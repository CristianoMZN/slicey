import { swagger } from '@elysiajs/swagger';

export const openApiPlugin = swagger({
    provider: 'scalar',
    path: '/swagger',
    documentation: {
        info: {
            title: 'Jobbie Backend API',
            version: '1.0.0',
            description: 'Auto-generated API documentation from route schemas'
        }
    }
});