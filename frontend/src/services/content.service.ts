import { api } from 'src/boot/axios';
import {
  adProfiles,
  adProfilesDetails,
  baseFeedPosts,
  chatThreadsSeed,
  frameVideos,
  portraitGalleryPool,
} from 'src/data/mock-content';
import { ensureGeolocationForApi } from 'src/services/geolocation.service';
import { useMockApi, wait } from 'src/services/runtime';
import type { AdProfile, AdProfileDetails, ChatThread, FeedPost, FrameVideo } from 'src/types/content';

const MAX_MOCK_FEED_PAGES = 3;

function cloneFeedPost(post: FeedPost): FeedPost {
  return {
    ...post,
    media: { ...post.media },
    comments: post.comments.map((comment) => ({ ...comment })),
  };
}

function createMockFeedBatch(page: number): FeedPost[] {
  return baseFeedPosts.map((template, index) => ({
    ...cloneFeedPost(template),
    id: page * 100 + template.id,
    timeAgo: page === 0 ? template.timeAgo : `${page + index + 2}h`,
    likes: template.likes + page * 17,
    liked: false,
    comments: template.comments.map((comment, commentIndex) => ({
      ...comment,
      id: page * 1000 + index * 100 + commentIndex + 1,
    })),
  }));
}

export async function fetchFeedPostsPage(page: number): Promise<FeedPost[]> {
  if (useMockApi) {
    await wait(400);
    if (page > MAX_MOCK_FEED_PAGES) {
      return [];
    }
    return createMockFeedBatch(page);
  }

  await ensureGeolocationForApi();

  // TODO(back-end): ajustar endpoint e mapear DTO real para FeedPost.
  const { data } = await api.get<FeedPost[]>('/feed', {
    params: {
      page,
      limit: 20,
    },
  });
  return data.map(cloneFeedPost);
}

export async function fetchAdProfiles(): Promise<AdProfile[]> {
  if (useMockApi) {
    await wait(280);
    return adProfiles.map((item) => ({ ...item }));
  }

  await ensureGeolocationForApi();

  // TODO(back-end): trocar para endpoint real de anuncios/perfis.
  const { data } = await api.get<AdProfile[]>('/ads/profiles');
  return data;
}

export async function fetchAdProfileDetailsById(id: number): Promise<AdProfileDetails | null> {
  if (useMockApi) {
    await wait(220);
    const found = adProfilesDetails.find((item) => item.id === id);
    return found ? { ...found, publicData: { ...found.publicData } } : null;
  }

  await ensureGeolocationForApi();

  // TODO(back-end): endpoint de detalhe com o id do perfil.
  const { data } = await api.get<AdProfileDetails>(`/ads/profiles/${id}`);
  return data;
}

export async function fetchPostsByAuthorId(authorId: number): Promise<FeedPost[]> {
  if (useMockApi) {
    await wait(220);
    return baseFeedPosts.filter((post) => post.authorId === authorId).map(cloneFeedPost);
  }

  await ensureGeolocationForApi();

  // TODO(back-end): endpoint de posts por autor/perfil.
  const { data } = await api.get<FeedPost[]>(`/profiles/${authorId}/posts`);
  return data.map(cloneFeedPost);
}

export async function fetchProfileGallery(profileId: number): Promise<string[]> {
  const profile = await fetchAdProfileDetailsById(profileId);

  if (!profile) {
    return [];
  }

  const merged = Array.from(
    new Set([
      profile.coverImage,
      profile.profileImage,
      ...profile.images,
      ...profile.gallery,
      ...portraitGalleryPool,
    ]),
  );
  const fallbackImage = merged[0] ?? '';

  return Array.from({ length: 36 }, (_, index) => merged[(index + profile.id) % merged.length] ?? fallbackImage);
}

export async function fetchChatThreads(): Promise<ChatThread[]> {
  if (useMockApi) {
    await wait(260);
    return chatThreadsSeed.map((thread) => ({
      ...thread,
      messages: thread.messages.map((message) => ({ ...message })),
    }));
  }

  await ensureGeolocationForApi();

  // TODO(back-end): endpoint de conversas do usuario autenticado.
  const { data } = await api.get<ChatThread[]>('/chat/threads');
  return data;
}

export async function fetchFrameVideos(): Promise<FrameVideo[]> {
  if (useMockApi) {
    await wait(280);
    return frameVideos.map((frame) => ({
      ...frame,
      comments: frame.comments.map((comment) => ({ ...comment })),
    }));
  }

  await ensureGeolocationForApi();

  // TODO(back-end): endpoint de videos curtos / frames.
  const { data } = await api.get<FrameVideo[]>('/frames');
  return data;
}
