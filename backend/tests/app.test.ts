import { describe, expect, it } from 'bun:test';
import app from '../src/app';

describe('Backend Application', () => {
    it('returns API info at root endpoint', async () => {
        const response = await app.handle(new Request('http://localhost/'));
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.name).toBe('Jobbie Backend API');
        expect(body.docs).toBe('/swagger');
    });

    it('serves swagger UI endpoint', async () => {
        const response = await app.handle(new Request('http://localhost/swagger'));

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type') ?? '').toContain('text/html');
    });

    it('validates login payload schema', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email: 'invalid-email', password: '123' })
            })
        );

        expect(response.status).toBe(422);
    });

    it('validates register payload schema', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email: 'invalid-email', password: '123' })
            })
        );

        expect(response.status).toBe(422);
    });
});