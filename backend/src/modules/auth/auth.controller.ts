import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async ({ body, set }: { body: { email: string; password: string }; set: { status?: number } }) => {
    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

    if (existingUser) {
        set.status = 409;
        return { message: 'User already exists' };
    }

    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password
        }
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }
    };
};

export const login = async ({ body, set }: { body: { email: string; password: string }; set: { status?: number } }) => {
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user || user.password !== body.password) {
        set.status = 401;
        return { message: 'Invalid credentials' };
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h'
    });

    await prisma.session.create({
        data: {
            userId: user.id,
            token
        }
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }
    };
};