import { Elysia } from 'elysia';
import { openApiPlugin } from './plugins/openapi';
import { prismaPlugin } from './plugins/prisma';
import { authRoutes } from './modules/auth/auth.routes';

const app = new Elysia()
  .get('/', () => ({
    name: 'Jobbie Backend API',
    message: 'Backend online. A documentacao da API esta disponivel em /swagger.',
    docs: '/swagger'
  }))
  .use(prismaPlugin)
  .use(authRoutes)
  .use(openApiPlugin);

export default app;