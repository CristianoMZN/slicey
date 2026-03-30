import type { CommentTemperature, SuperCommentPayload } from 'src/types/comments';

export interface FeedComment {
  id: number;
  author: string;
  timeAgo: string;
  body: string;
  superComment?: SuperCommentPayload;
}

export interface FeedPost {
  id: number;
  author: string;
  authorId?: number;
  location: string;
  timeAgo: string;
  title: string;
  description: string;
  likes: number;
  liked: boolean;
  media:
    | {
        type: 'text';
      }
    | {
        type: 'audio';
        src: string;
        coverImage: string;
        subtitle: string;
      }
    | {
        type: 'video';
        src: string;
        poster: string;
      }
    | {
        type: 'image';
        src: string;
        alt: string;
      };
  comments: FeedComment[];
}

export type AdGender = 'Feminino' | 'Masculino' | 'Nao-binario';
export type AdSexuality = 'Cis' | 'Trans';
export type AdProfileBadge = 'verified-account' | 'leaving-soon' | 'new-profile' | 'top-rated-10';

export interface AdProfile {
  id: number;
  name: string;
  city: string;
  state?: string;
  age?: number;
  hasLocal?: boolean;
  leavingInDays?: number;
  badge: string;
  badges?: AdProfileBadge[];
  bio: string;
  hourlyRate: string;
  images: string[];
  gender: AdGender;
  sexuality: AdSexuality;
}

export interface AdProfileDetails extends AdProfile {
  coverImage: string;
  profileImage: string;
  age: number;
  neighborhood: string;
  availability: string;
  languages: string[];
  publicData: {
    height: string;
    weight: string;
    bodyType: string;
    hairColor: string;
    eyeColor: string;
    ethnicity: string;
    style: string;
    personalityTraits: string[];
  };
  services: string[];
  gallery: string[];
}

export interface ChatMessage {
  id: number;
  sender: 'me' | 'contact';
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: number;
  contactName: string;
  contactAvatar: string;
  online: boolean;
  city: string;
  lastPreview: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface FrameVideo {
  id: number;
  author: string;
  authorId?: number;
  location: string;
  title: string;
  description: string;
  videoSrc: string;
  poster: string;
  likes: number;
  liked: boolean;
  comments: FeedComment[];
}

export const commentTemperatureLabelMap: Record<CommentTemperature, string> = {
  cold: 'Frosty',
  warm: 'Simmering',
  hot: 'Steamy',
  blaze: 'Blazing',
};
