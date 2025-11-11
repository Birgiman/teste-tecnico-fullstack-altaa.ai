import { logoutController } from '@/controllers/auth.controller.js';
import { authMiddleware } from '@/middlewares/auth.middleware.js';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import companyRoutes from './company.routes.js';
import inviteRoutes from './invite.routes.js';

export default fp(
  async function (app: FastifyInstance) {
    app.addHook('preHandler', authMiddleware);

    await app.register(companyRoutes);
    await app.register(inviteRoutes);

    app.post('/auth/logout', logoutController);
  },
  {
    name: 'protected-routes',
    encapsulate: true,
  },
);
