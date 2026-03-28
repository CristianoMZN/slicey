import { Elysia, t } from 'elysia';
import { login, register } from './auth.controller';
import {
	LoginBodySchema,
	LoginResponseSchema,
	RegisterBodySchema,
	RegisterResponseSchema
} from './auth.schema';

export const authRoutes = new Elysia({ prefix: '/auth' })
	.post('/register', register, {
		body: RegisterBodySchema,
		response: {
			200: RegisterResponseSchema,
			409: t.Object({ message: t.String() })
		},
		detail: {
			tags: ['Auth'],
			summary: 'Register user'
		}
	})
	.post('/login', login, {
		body: LoginBodySchema,
		response: {
			200: LoginResponseSchema,
			401: t.Object({ message: t.String() })
		},
		detail: {
			tags: ['Auth'],
			summary: 'Login and receive JWT token'
		}
	});