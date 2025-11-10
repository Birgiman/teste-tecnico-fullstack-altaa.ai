import {
  acceptInviteController,
  createInviteController,
} from '@/controllers/invite.controller.js';
import fp from 'fastify-plugin';

export default fp(
  async function (app) {
    app.post('/company/:id/invite', createInviteController);
    app.post('/auth/accept-invite', acceptInviteController);
  },
  {
    name: 'invite-routes',
  },
);
