import { prisma } from '@/lib/prisma.js';
import { createAppError } from '@/utils/app-error.util.js';
import { verifyToken } from '@/utils/jwt.utils.js';
import type { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
      activeCompanyId: string | null;
    };
  }
}

export const authMiddleware = async (req: FastifyRequest) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw createAppError('TOKEN_NOT_FOUND');
    }
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { activeCompanyId: true },
    });

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      activeCompanyId: user?.activeCompanyId || null,
    };
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createAppError('INVALID_TOKEN');
  }
};
