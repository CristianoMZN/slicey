import { Elysia } from 'elysia';

export const websocketPlugin = new Elysia().ws('/ws', {
    open() {
        console.log('A client connected');
    },
    message(ws: { send: (payload: string) => void }, message: unknown) {
        const payload = typeof message === 'string' ? message : String(message);
        console.log('Received message:', payload);
        ws.send(payload);
    },
    close() {
        console.log('A client disconnected');
    }
});