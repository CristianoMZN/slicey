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
    allowComments?: boolean;
};

type LikeBody = {
    type?: string;
    geoLocation?: string;
    userId?: number;
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
            allowComments: body.allowComments ?? true
        }
    });

    return {
        ...post,
        mediaUrl: await storageService.signMediaUrl(post.mediaUrl),
        createdAt: post.createdAt.toISOString()
    };
};

export const getFeed = async () => {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
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
