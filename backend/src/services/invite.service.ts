import { prisma } from '@/lib/prisma.js';
import { Role, RoleEnum } from '@/types/role.types.js';
import { createAppError } from '@/utils/app-error.util.js';
import { generateInviteToken } from '@/utils/invite-token.util.js';

export const createInviteService = async (
  requesterUserId: string,
  companyId: string,
  email: string,
  role: Role,
  expiresInDays: number,
) => {
  const requesterMembership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId: requesterUserId,
        companyId,
      },
    },
    select: {
      role: true,
    },
  });

  if (
    !requesterMembership ||
    !([RoleEnum.OWNER, RoleEnum.ADMIN] as Role[]).includes(
      requesterMembership.role,
    )
  ) {
    throw createAppError('NO_PERMISSION_TO_INVITE');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const alreadyMember = await prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId: existingUser.id,
          companyId,
        },
      },
    });

    if (alreadyMember) {
      throw createAppError('USER_ALREADY_MEMBER');
    }
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const token = generateInviteToken();

  const invite = await prisma.invite.upsert({
    where: {
      email_companyId: {
        email,
        companyId,
      },
    },
    update: {
      token,
      role,
      expiresAt,
    },
    create: {
      email,
      token,
      role,
      expiresAt,
      companyId,
      createdById: requesterUserId,
    },
  });

  return invite;
};

export const acceptInviteService = async (
  currentUserId: string,
  currentUserEmail: string,
  token: string,
) => {
  const invite = await prisma.invite.findUnique({
    where: { token },
  });

  if (!invite) {
    throw createAppError('INVITE_INVALID');
  }

  if (invite.expiresAt <= new Date()) {
    throw createAppError('INVITE_EXPIRED');
  }

  if (invite.email.toLowerCase() !== currentUserEmail.toLowerCase()) {
    throw createAppError('INVITE_EMAIL_MISMATCH');
  }

  const alreadyMember = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId: currentUserId,
        companyId: invite.companyId,
      },
    },
  });

  if (alreadyMember) {
    await prisma.invite.delete({
      where: { id: invite.id },
    });
    return {
      message: 'Você já é membro desta empresa. Convite invalidado.',
      companyId: invite.companyId,
    };
  }

  await prisma.membership.create({
    data: {
      userId: currentUserId,
      companyId: invite.companyId,
      role: invite.role,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { activeCompanyId: true },
  });

  if (!user?.activeCompanyId) {
    await prisma.user.update({
      where: { id: currentUserId },
      data: { activeCompanyId: invite.companyId },
    });
  }

  await prisma.invite.delete({
    where: { id: invite.id },
  });

  return {
    message: 'Convite aceito com sucesso',
    companyId: invite.companyId,
  };
};
