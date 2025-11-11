import { prisma } from '@/lib/prisma.js';
import { Role } from '@/types/role.types.js';
import { createAppError } from '@/utils/app-error.util.js';
import type { FastifyRequest } from 'fastify';

export function authorize(allowedRoles: Role[]) {
  return async (request: FastifyRequest) => {
    if (!request.user) {
      throw createAppError('INVALID_TOKEN');
    }

    const { userId, activeCompanyId } = request.user;

    if (!activeCompanyId) {
      throw createAppError(
        'TOKEN_NOT_FOUND',
        'Nenhuma empresa ativa selecionada',
      );
    }

    const params = request.params as { id?: string } | undefined;
    if (params?.id && params.id !== activeCompanyId) {
      throw createAppError('COMPANY_NOT_FOUND');
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: activeCompanyId,
        },
      },
      select: { role: true },
    });

    if (!membership) {
      throw createAppError('USER_NOT_MEMBER');
    }

    if (!allowedRoles.includes(membership.role)) {
      throw createAppError('NO_PERMISSION_TO_EDIT');
    }
  };
}

export const authorizeOwnerOrAdmin = () => authorize(['OWNER', 'ADMIN']);

export const authorizeOwner = () => authorize(['OWNER']);

export const authorizeMember = () => authorize(['OWNER', 'ADMIN', 'MEMBER']);
