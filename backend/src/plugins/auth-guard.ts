import { Elysia } from 'elysia';
import { JwtPayload, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret';

type AuthUser = {
    id: number;
    email?: string;
    role?: string;
    type?: string;
};

const toAuthUser = (payload: string | JwtPayload | null): AuthUser | null => {
    if (!payload || typeof payload === 'string' || !payload.sub) {
        return null;
    }

    const id = Number(payload.sub);

    if (!Number.isFinite(id)) {
        return null;
    }

    return {
        id,
        email: typeof payload.email === 'string' ? payload.email : undefined,
        role: typeof payload.role === 'string' ? payload.role : undefined,
        type: typeof payload.type === 'string' ? payload.type : undefined
    };
};

const isPublicPath = (path: string) =>
    path === '/' || path.startsWith('/auth') || path === '/swagger' || path.startsWith('/swagger/');

export const authGuardPlugin = (app: Elysia) =>
    app
        .derive(({ headers }) => {
            const authHeader = headers.authorization;
            if (!authHeader) {
                return { authUser: null as AuthUser | null };
            }

            const [scheme, token] = authHeader.split(' ');
            if (scheme?.toLowerCase() !== 'bearer' || !token) {
                return { authUser: null as AuthUser | null };
            }

            try {
                const decoded = verify(token, JWT_SECRET) as string | JwtPayload;
                return { authUser: toAuthUser(decoded) };
            } catch {
                return { authUser: null as AuthUser | null };
            }
        })
        .onBeforeHandle((ctx: { request: Request; authUser: AuthUser | null; set: { status?: number } }) => {
            const { request, authUser, set } = ctx;
            const path = new URL(request.url).pathname;

            if (isPublicPath(path)) {
                return;
            }

            if (!authUser) {
                set.status = 401;
                return { message: 'Invalid or missing token' };
            }
        });
