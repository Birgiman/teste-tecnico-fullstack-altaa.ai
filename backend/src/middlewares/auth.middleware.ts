import { verifyToken } from '@/utils/jwt.utils.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
    };
  }
}

export const authMiddleware = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: 'Token não encontrado',
      });
    }
    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch {
    return res.status(401).send({
      success: false,
      message: 'Token inválido',
    });
  }
};
