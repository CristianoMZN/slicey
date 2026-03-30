import { MediaType } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { storageService } from '../../services/storage.service';

type AuthUser = {
    id: number;
};

type CreatePostBody = {
    type: MediaType;
    content?: string;
    mediaUrl?: string;
    duration?: number;
    location?: string;
    latitude?: number;
    longitude?: number;
    allowComments?: boolean;
};

type LikeBody = {
    type?: string;
    geoLocation?: string;
    userId?: number;
};

type FeedQuery = {
    page?: number;
    limit?: number;
    radiusKm?: number;
    geoLat?: number;
    geoLng?: number;
};

type GeoContext = {
    latitude: number;
    longitude: number;
    radiusKm: number;
} | null;

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversineDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};

const resolveGeoContext = (query: FeedQuery, geoContext: GeoContext) => {
    const queryLat = Number(query.geoLat);
    const queryLng = Number(query.geoLng);
    const queryRadius = Number(query.radiusKm);

    if (Number.isFinite(queryLat) && Number.isFinite(queryLng)) {
        return {
            latitude: queryLat,
            longitude: queryLng,
            radiusKm: Number.isFinite(queryRadius) ? Math.min(500, Math.max(1, queryRadius)) : 30
        };
    }

    return geoContext;
};

export const createPost = async ({
    body,
    authUser,
    set
}: {
    body: CreatePostBody;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    if (!authUser) {
        set.status = 401;
        return { message: 'Invalid or missing token' };
    }

    const post = await prisma.post.create({
        data: {
            authorId: authUser.id,
            type: body.type,
            content: body.content,
            mediaUrl: body.mediaUrl,
            duration: body.duration,
            location: body.location,
            latitude: body.latitude,
            longitude: body.longitude,
            allowComments: body.allowComments ?? true
        }
    });

    return {
        ...post,
        mediaUrl: await storageService.signMediaUrl(post.mediaUrl),
        createdAt: post.createdAt.toISOString()
    };
};

export const getFeed = async ({
    query,
    geoContext
}: {
    query: FeedQuery;
    geoContext: GeoContext;
}) => {
    const page = Number.isFinite(Number(query.page)) ? Math.max(0, Number(query.page)) : 0;
    const limit = Number.isFinite(Number(query.limit)) ? Math.min(100, Math.max(1, Number(query.limit))) : 20;
    const activeGeoContext = resolveGeoContext(query, geoContext);

    const basePosts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip: page * limit,
        take: limit,
        include: {
            author: {
                select: {
                    id: true,
                    nickname: true,
                    type: true,
                    profile: {
                        select: {
                            publicName: true,
                            slug: true,
                            profileImage: true,
                            isPublic: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    comments: true,
                    interactions: {
                        where: {
                            canceledAt: null,
                            type: 'LIKE'
                        }
                    }
                }
            }
        }
    });

    const posts = activeGeoContext
        ? basePosts.filter(post => {
              if (!Number.isFinite(post.latitude) || !Number.isFinite(post.longitude)) {
                  return false;
              }

              const distanceKm = haversineDistanceKm(
                  activeGeoContext.latitude,
                  activeGeoContext.longitude,
                  post.latitude as number,
                  post.longitude as number
              );

              return distanceKm <= activeGeoContext.radiusKm;
          })
        : basePosts;

    return Promise.all(
        posts.map(async post => {
            const authorProfile = post.author.profile?.isPublic
                ? {
                      publicName: post.author.profile.publicName,
                      slug: post.author.profile.slug,
                      profileImage: await storageService.signMediaUrl(post.author.profile.profileImage)
                  }
                : null;

            return {
                id: post.id,
                type: post.type,
                content: post.content,
                mediaUrl: await storageService.signMediaUrl(post.mediaUrl),
                duration: post.duration,
                location: post.location,
                latitude: post.latitude,
                longitude: post.longitude,
                allowComments: post.allowComments,
                createdAt: post.createdAt.toISOString(),
                author: {
                    id: post.author.id,
                    nickname: post.author.nickname,
                    type: post.author.type,
                    profile: authorProfile
                },
                _count: {
                    comments: post._count.comments,
                    interactions: post._count.interactions
                }
            };
        })
    );
};

export const likePost = async ({
    params,
    body,
    authUser,
    set
}: {
    params: { id: number };
    body: LikeBody;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    if (!authUser) {
        set.status = 401;
        return { message: 'Invalid or missing token' };
    }

    const postId = Number(params.id);
    const existingPost = await prisma.post.findUnique({ where: { id: postId } });

    if (!existingPost) {
        set.status = 404;
        return { message: 'Post not found' };
    }

    const interactionType = body.type?.trim().toUpperCase() || 'LIKE';
    const currentInteraction = await prisma.interaction.findUnique({
        where: {
            postId_userId_type: {
                postId,
                userId: authUser.id,
                type: interactionType
            }
        }
    });

    const interaction = currentInteraction
        ? await prisma.interaction.update({
              where: { id: currentInteraction.id },
              data: {
                  geoLocation: body.geoLocation,
                  canceledAt: null
              }
          })
        : await prisma.interaction.create({
              data: {
                  postId,
                  userId: authUser.id,
                  type: interactionType,
                  geoLocation: body.geoLocation
              }
          });

    return {
        id: interaction.id,
        postId: interaction.postId,
        userId: interaction.userId,
        type: interaction.type,
        geoLocation: interaction.geoLocation,
        canceledAt: interaction.canceledAt?.toISOString() ?? null,
        createdAt: interaction.createdAt.toISOString()
    };
};
