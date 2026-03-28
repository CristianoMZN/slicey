import { prisma } from '../../config/prisma';
import { storageService } from '../../services/storage.service';

type AuthUser = {
    id: number;
};

type UploadBody = {
    mediaType: string;
    extension?: string;
    contentType?: string;
};

export const createUploadUrl = async ({
    body,
    authUser,
    set
}: {
    body: UploadBody;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    if (!authUser) {
        set.status = 401;
        return { message: 'Invalid or missing token' };
    }

    const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { type: true }
    });

    if (!user) {
        set.status = 404;
        return { message: 'User not found' };
    }

    if (user.type !== 'CREATOR') {
        set.status = 403;
        return { message: 'Only CREATOR users can upload media' };
    }

    try {
        return await storageService.createUploadUrl({
            userId: authUser.id,
            mediaType: body.mediaType,
            extension: body.extension,
            contentType: body.contentType
        });
    } catch {
        set.status = 500;
        return { message: 'Storage service is not configured' };
    }
};
