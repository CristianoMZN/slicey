import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENV } from '../config/env';

const BUCKET = ENV.STORAGE_NAME;
const EXPIRES_IN_SECONDS = 300;

const hasStorageConfig =
    Boolean(ENV.STORAGE_URL) &&
    Boolean(ENV.STORAGE_ACCESS_KEY) &&
    Boolean(ENV.STORAGE_SECRET_KEY) &&
    Boolean(BUCKET);

const s3Client = hasStorageConfig
    ? new S3Client({
          region: ENV.STORAGE_REGION,
          endpoint: ENV.STORAGE_URL,
          forcePathStyle: true,
          credentials: {
              accessKeyId: ENV.STORAGE_ACCESS_KEY,
              secretAccessKey: ENV.STORAGE_SECRET_KEY
          }
      })
    : null;

const normalizeObjectKey = (mediaUrl: string): string => {
    if (mediaUrl.startsWith('s3://')) {
        return mediaUrl.replace(`s3://${BUCKET}/`, '').replace(/^\//, '');
    }

    if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
        const parsedUrl = new URL(mediaUrl);
        const bucketPrefix = `/${BUCKET}/`;

        if (parsedUrl.pathname.startsWith(bucketPrefix)) {
            return parsedUrl.pathname.replace(bucketPrefix, '');
        }

        return parsedUrl.pathname.replace(/^\//, '');
    }

    return mediaUrl.replace(/^\//, '');
};

const toMediaExtension = (rawExtension?: string) => {
    if (!rawExtension) {
        return 'bin';
    }

    return rawExtension.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const storageService = {
    async signMediaUrl(mediaUrl?: string | null) {
        if (!mediaUrl || !s3Client) {
            return mediaUrl ?? null;
        }

        const objectKey = normalizeObjectKey(mediaUrl);
        const command = new GetObjectCommand({
            Bucket: BUCKET,
            Key: objectKey
        });

        return getSignedUrl(s3Client, command, { expiresIn: EXPIRES_IN_SECONDS });
    },

    async createUploadUrl(input: { userId: number; mediaType: string; extension?: string; contentType?: string }) {
        if (!s3Client) {
            throw new Error('Storage service is not configured');
        }

        const extension = toMediaExtension(input.extension);
        const objectKey = `users/${input.userId}/${input.mediaType.toLowerCase()}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
            ContentType: input.contentType || 'application/octet-stream'
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: EXPIRES_IN_SECONDS });

        return {
            objectKey,
            uploadUrl,
            expiresIn: EXPIRES_IN_SECONDS
        };
    }
};
