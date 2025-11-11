import { prisma } from '@/lib/prisma.js';
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from '@/schemas/company.schema.js';
import { Role, RoleEnum } from '@/types/role.types.js';
import { createAppError } from '@/utils/app-error.util.js';

export const createCompanyService = async (
  userId: string,
  data: CreateCompanyInput,
) => {
  const company = await prisma.company.create({
    data: {
      name: data.name,
      logoUrl: data.logoUrl,
      members: {
        create: {
          userId,
          role: RoleEnum.OWNER,
        },
      },
    },
    include: {
      members: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { activeCompanyId: company.id },
  });

  return company;
};

export const listCompaniesService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      skip,
      take: limit,
      include: {
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.company.count({
      where: {
        members: {
          some: { userId },
        },
      },
    }),
  ]);

  return {
    companies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCompanyService = async (userId: string, companyId: string) => {
  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!company) {
    throw createAppError('COMPANY_NOT_FOUND');
  }

  return company;
};

export const updateCompanyService = async (
  userId: string,
  companyId: string,
  data: UpdateCompanyInput,
) => {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!membership) {
    throw createAppError('COMPANY_NOT_FOUND');
  }

  if (!([RoleEnum.OWNER, RoleEnum.ADMIN] as Role[]).includes(membership.role)) {
    throw createAppError('NO_PERMISSION_TO_EDIT');
  }

  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      name: data.name,
      logoUrl: data.logoUrl,
    },
    include: {
      members: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return company;
};

export const deleteCompanyService = async (
  userId: string,
  companyId: string,
) => {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!membership) {
    throw createAppError('COMPANY_NOT_FOUND');
  }

  if (membership.role !== RoleEnum.OWNER) {
    throw createAppError('ONLY_OWNER_CAN_DELETE');
  }

  await prisma.company.delete({
    where: { id: companyId },
  });

  await prisma.user.updateMany({
    where: { activeCompanyId: companyId },
    data: { activeCompanyId: null },
  });

  return { message: 'Empresa deletada com sucesso' };
};

export const selectActiveCompanyService = async (
  userId: string,
  companyId: string,
) => {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!membership) {
    throw createAppError('USER_NOT_MEMBER');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { activeCompanyId: companyId },
  });

  return {
    message: 'Empresa ativa alterada com sucesso',
    activeCompanyId: companyId,
  };
};

export const removeMemberService = async (
  requesterUserId: string,
  companyId: string,
  targetUserId: string,
) => {
  const requesterMembership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId: requesterUserId,
        companyId,
      },
    },
  });

  if (!requesterMembership) {
    throw createAppError('USER_NOT_MEMBER');
  }

  if (
    !([RoleEnum.OWNER, RoleEnum.ADMIN] as Role[]).includes(
      requesterMembership.role,
    )
  ) {
    throw createAppError('NO_PERMISSION_TO_EDIT');
  }

  const targetMembership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId: targetUserId,
        companyId,
      },
    },
  });

  if (!targetMembership) {
    throw createAppError('USER_NOT_MEMBER');
  }

  if (targetMembership.role !== RoleEnum.MEMBER) {
    throw createAppError('MEMBER_REMOVAL_NOT_ALLOWED');
  }

  await prisma.membership.delete({
    where: {
      userId_companyId: {
        userId: targetUserId,
        companyId,
      },
    },
  });

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { activeCompanyId: true },
  });

  if (targetUser?.activeCompanyId === companyId) {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { activeCompanyId: null },
    });
  }

  return { message: 'Membro removido com sucesso' };
};
