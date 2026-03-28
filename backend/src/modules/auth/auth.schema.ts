import { t } from 'elysia';

export const UserPublicSchema = t.Object({
  id: t.Number(),
  email: t.String({ format: 'email' }),
  nickname: t.String(),
  role: t.Union([t.Literal('USER'), t.Literal('MANAGER'), t.Literal('ADMIN')]),
  type: t.Union([t.Literal('CUSTOMER'), t.Literal('CREATOR')]),
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' })
});

export const RegisterBodySchema = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 }),
  nickname: t.String({ minLength: 3 })
});

export const RegisterResponseSchema = t.Object({
  user: UserPublicSchema
});

export const LoginBodySchema = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 })
});

export const LoginResponseSchema = t.Object({
  token: t.String(),
  user: UserPublicSchema
});