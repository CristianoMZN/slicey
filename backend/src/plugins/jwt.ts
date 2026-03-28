import { Elysia } from 'elysia';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret';
type JwtUser = JwtPayload | string;

export const jwtPlugin = (app: Elysia) =>
    app.decorate('jwt', {
        sign(payload: object, expiresIn: SignOptions['expiresIn'] = '1h') {
            return jwt.sign(payload, JWT_SECRET, { expiresIn });
        },
        verify(token: string): JwtUser | null {
            try {
                return jwt.verify(token, JWT_SECRET) as JwtUser;
            } catch {
                return null;
            }
        }
    });