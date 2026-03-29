export type PostComposerMode = 'text' | 'image' | 'audio';

export interface PostComposerPayload {
  mode: PostComposerMode;
  title: string;
  description: string;
  mediaFile: File | null;
  mediaPreviewUrl: string | null;
}
