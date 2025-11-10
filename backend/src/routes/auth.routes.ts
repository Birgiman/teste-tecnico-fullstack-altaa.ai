import {
  loginController,
  signupController,
} from '@/controllers/auth.controller.js';
import fp from 'fastify-plugin';

export default fp(
  async function (app) {
    app.post('/auth/signup', signupController);
    app.post('/auth/login', loginController);
  },
  {
    name: 'auth-routes',
  },
);
