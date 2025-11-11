import {
  acceptInviteController,
  createInviteController,
} from '@/controllers/invite.controller.js';
import { authorizeOwnerOrAdmin } from '@/middlewares/authorize.middleware.js';
import fp from 'fastify-plugin';

export default fp(
  async function (app) {
    app.post(
      '/company/:id/invite',
      { preHandler: [authorizeOwnerOrAdmin()] },
      createInviteController,
    );

    app.post('/auth/accept-invite', acceptInviteController);
  },
  {
    name: 'invite-routes',
  },
);
