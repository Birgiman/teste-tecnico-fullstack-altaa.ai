import { Reply, Req } from '@/types/fastify.types.js';
import ScalarApiReference from '@scalar/fastify-api-reference';
import type { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes.js';

export async function registerPublicRoutes(app: FastifyInstance) {
  app.get('/', async (_req: Req, _res: Reply) => {
    return { message: 'Backend rodando com Fastify!' };
  });

  await app.register(ScalarApiReference, {
    routePrefix: '/docs',
  });

  await app.register(authRoutes);
}
