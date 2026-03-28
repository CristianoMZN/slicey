import { Elysia } from 'elysia';
import { JwtPayload, verify } from 'jsonwebtoken';

type AuthUser = JwtPayload | string;

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret';

export const bearerPlugin = (app: Elysia) =>
    app
        .derive(({ headers }) => {
            const authHeader = headers.authorization;

            if (!authHeader) {
                return { user: null as AuthUser | null };
            }

            const [, token] = authHeader.split(' ');

            if (!token) {
                return { user: null as AuthUser | null };
            }

            try {
                return { user: verify(token, JWT_SECRET) as AuthUser };
            } catch {
                return { user: null as AuthUser | null };
            }
        })
        .onBeforeHandle((ctx: { request: Request; user: AuthUser | null; set: { status?: number } }) => {
            const { request, user, set } = ctx;
            const path = new URL(request.url).pathname;

            if (path.startsWith('/auth') || path === '/swagger' || path.startsWith('/swagger/')) {
                return;
            }

            if (!user) {
                set.status = 401;
                return { message: 'Invalid or missing token' };
            }
        });