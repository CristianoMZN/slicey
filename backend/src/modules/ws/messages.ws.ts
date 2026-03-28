let server: ReturnType<typeof Bun.serve> | null = null;

export const startWebSocketServer = () => {
    if (server) return server;

    server = Bun.serve({
        port: 3001,
        fetch(req, server) {
            if (new URL(req.url).pathname === '/ws') {
                const upgraded = server.upgrade(req, { data: undefined });

                if (upgraded) return;
                return new Response('WebSocket upgrade failed', { status: 400 });
            }

            return new Response('WebSocket server is running', { status: 200 });
        },
        websocket: {
            message(ws, message) {
                const payload = typeof message === 'string' ? message : String(message);
                console.log('Received message:', payload);
                ws.send(`Echo: ${payload}`);
            },
            close() {
                console.log('Client disconnected');
            }
        }
    });

    console.log('WebSocket server is running on ws://localhost:3001/ws');
    return server;
};