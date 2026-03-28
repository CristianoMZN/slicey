import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

type RegisterBody = {
    email: string;
    password: string;
    nickname: string;
};

type LoginBody = {
    email: string;
    password: string;
};

export const register = async ({ body, set }: { body: RegisterBody; set: { status?: number } }) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email: body.email }, { nickname: body.nickname }]
        }
    });

    if (existingUser) {
        set.status = 409;
        return { message: 'User with same email or nickname already exists' };
    }

    const hashedPassword = await Bun.password.hash(body.password);

    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: hashedPassword,
            nickname: body.nickname
        }
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
            type: user.type,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }
    };
};

export const login = async ({ body, set }: { body: LoginBody; set: { status?: number } }) => {
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    const passwordIsValid = user
        ? await Bun.password.verify(body.password, user.password).catch(() => user.password === body.password)
        : false;

    if (!user || !passwordIsValid) {
        set.status = 401;
        return { message: 'Invalid credentials' };
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, type: user.type }, JWT_SECRET, {
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
            nickname: user.nickname,
            role: user.role,
            type: user.type,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }
    };
};