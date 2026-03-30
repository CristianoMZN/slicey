export type CommentTemperature = 'cold' | 'warm' | 'hot' | 'blaze';

export interface SuperCommentPayload {
  amount: number;
  temperature: CommentTemperature;
}

export interface SubmitCommentPayload {
  message: string;
  superComment?: SuperCommentPayload;
}
