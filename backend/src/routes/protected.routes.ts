import { authMiddleware } from '@/middlewares/auth.middleware.js';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import companyRoutes from './company.routes.js';

export default fp(
  async function (app: FastifyInstance) {
    app.addHook('preHandler', authMiddleware);
    await app.register(companyRoutes);
  },
  {
    name: 'protected-routes',
    encapsulate: true,
  },
);
