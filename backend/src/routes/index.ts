import type { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes.js';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes);

  app.get('/', async (_req, _res) => {
    return { message: 'Backend rodando com Fastify!' };
  });
}
