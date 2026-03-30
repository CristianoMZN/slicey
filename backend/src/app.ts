import { Elysia } from 'elysia';
import { openApiPlugin } from './plugins/openapi';
import { prismaPlugin } from './plugins/prisma';
import { authRoutes } from './modules/auth/auth.routes';
import { authGuardPlugin } from './plugins/auth-guard';
import { sanitizePlugin } from './plugins/sanitize';
import { profileRoutes } from './modules/profile/profile.routes';
import { postsRoutes } from './modules/posts/posts.routes';
import { mediaRoutes } from './modules/media/media.routes';
import { pushRoutes } from './modules/push/push.routes';
import { geoContextPlugin } from './plugins/geo-context';

const app = new Elysia()
  .get('/', () => ({
    name: 'Jobbie Backend API',
    message: 'Backend online. A documentacao da API esta disponivel em /swagger.',
    docs: '/swagger'
  }))
  .get('/swagger/swagger/json', ({ request }) =>
    Response.redirect(new URL('/swagger/json', request.url), 307)
  )
  .use(prismaPlugin)
  .use(sanitizePlugin)
  .use(geoContextPlugin)
  .use(authGuardPlugin)
  .use(authRoutes)
  .use(pushRoutes)
  .use(profileRoutes)
  .use(postsRoutes)
  .use(mediaRoutes)
  .use(openApiPlugin);

export default app;