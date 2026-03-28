import { Elysia } from 'elysia';
import DOMPurify from 'isomorphic-dompurify';

const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
        return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object') {
        const next = value as Record<string, unknown>;

        for (const key of Object.keys(next)) {
            next[key] = sanitizeValue(next[key]);
        }
    }

    return value;
};

export const sanitizePlugin = (app: Elysia) =>
    app.onBeforeHandle(({ body }) => {
        if (body && typeof body === 'object') {
            sanitizeValue(body);
        }
    });
