export type CommentTemperature = 'cold' | 'warm' | 'hot' | 'blaze';

export const SUPER_COMMENT_MIN_AMOUNT = 100;
export const SUPER_COMMENT_SLIDER_MAX = 20000;

export interface SuperCommentPayload {
  amount: number;
  temperature: CommentTemperature;
}

export interface SubmitCommentPayload {
  message: string;
  superComment?: SuperCommentPayload;
}

export function resolveSuperCommentTemperature(amount: number): CommentTemperature {
  if (amount >= 20000) {
    return 'blaze';
  }

  if (amount >= 5000) {
    return 'hot';
  }

  if (amount >= 500) {
    return 'warm';
  }

  return 'cold';
}
