import { prisma } from '../../config/prisma';
import { storageService } from '../../services/storage.service';

type AuthUser = {
    id: number;
};

type ProfileInput = {
    publicName: string;
    slug: string;
    bio?: string;
    profileImage?: string;
    coverImage?: string;
    services?: string;
    isPublic: boolean;
    fullName: string;
    cpf: string;
    birthDate: string;
    pixKey?: string;
    bankAccount?: unknown;
    address?: unknown;
};

const serializeProfile = async (profile: {
    id: number;
    userId: number;
    publicName: string;
    slug: string;
    bio: string | null;
    profileImage: string | null;
    coverImage: string | null;
    services: string | null;
    isPublic: boolean;
    fullName: string;
    cpf: string;
    birthDate: Date;
    pixKey: string | null;
    bankAccount: unknown;
    address: unknown;
    updatedAt: Date;
}, includeSensitive: boolean) => {
    const profileImage = await storageService.signMediaUrl(profile.profileImage);
    const coverImage = await storageService.signMediaUrl(profile.coverImage);

    const base = {
        id: profile.id,
        userId: profile.userId,
        publicName: profile.publicName,
        slug: profile.slug,
        bio: profile.bio,
        profileImage,
        coverImage,
        services: profile.services,
        isPublic: profile.isPublic,
        fullName: profile.fullName,
        birthDate: profile.birthDate.toISOString(),
        updatedAt: profile.updatedAt.toISOString()
    };

    if (!includeSensitive) {
        return base;
    }

    return {
        ...base,
        cpf: profile.cpf,
        pixKey: profile.pixKey,
        bankAccount: profile.bankAccount,
        address: profile.address
    };
};

export const upsertMyProfile = async ({
    body,
    authUser,
    set
}: {
    body: ProfileInput;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    if (!authUser) {
        set.status = 401;
        return { message: 'Invalid or missing token' };
    }

    const profile = await prisma.profile.upsert({
        where: { userId: authUser.id },
        create: {
            userId: authUser.id,
            publicName: body.publicName,
            slug: body.slug,
            bio: body.bio,
            profileImage: body.profileImage,
            coverImage: body.coverImage,
            services: body.services,
            isPublic: body.isPublic,
            fullName: body.fullName,
            cpf: body.cpf,
            birthDate: new Date(body.birthDate),
            pixKey: body.pixKey,
            bankAccount: body.bankAccount,
            address: body.address
        },
        update: {
            publicName: body.publicName,
            slug: body.slug,
            bio: body.bio,
            profileImage: body.profileImage,
            coverImage: body.coverImage,
            services: body.services,
            isPublic: body.isPublic,
            fullName: body.fullName,
            cpf: body.cpf,
            birthDate: new Date(body.birthDate),
            pixKey: body.pixKey,
            bankAccount: body.bankAccount,
            address: body.address
        }
    });

    return serializeProfile(profile, true);
};

export const getMyProfile = async ({ authUser, set }: { authUser: AuthUser | null; set: { status?: number } }) => {
    if (!authUser) {
        set.status = 401;
        return { message: 'Invalid or missing token' };
    }

    const profile = await prisma.profile.findUnique({ where: { userId: authUser.id } });

    if (!profile) {
        set.status = 404;
        return { message: 'Profile not found' };
    }

    return serializeProfile(profile, true);
};

export const getProfileById = async ({
    params,
    authUser,
    set
}: {
    params: { id: number };
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    if (!authUser) {
        set.status = 401;
        return { message: 'Invalid or missing token' };
    }

    const targetUserId = Number(params.id);
    const profile = await prisma.profile.findUnique({ where: { userId: targetUserId } });

    if (!profile) {
        set.status = 404;
        return { message: 'Profile not found' };
    }

    const isSelf = authUser.id === targetUserId;

    if (!profile.isPublic && !isSelf) {
        set.status = 403;
        return { message: 'Profile is private' };
    }

    return serializeProfile(profile, isSelf);
};
