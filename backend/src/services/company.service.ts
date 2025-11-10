import { prisma } from '@/lib/prisma.js';
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from '@/schemas/company.schema.js';

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
          role: 'OWNER',
        },
      },
    },
    include: {
      members: {
        include: {
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
          include: {
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
        include: {
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
    throw new Error('Empresa não encontrada');
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
    throw new Error('Empresa não encontrada ou você não é membro dela');
  }

  if (!['OWNER', 'ADMIN'].includes(membership.role)) {
    throw new Error('Você não tem permissão para editar esta empresa');
  }

  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      name: data.name,
      logoUrl: data.logoUrl,
    },
    include: {
      members: {
        include: {
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
    throw new Error('Empresa não encontrada');
  }

  if (membership.role !== 'OWNER') {
    throw new Error('Apenas o criador pode deletar a empresa');
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
    throw new Error('Você não é membro desta empresa');
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
