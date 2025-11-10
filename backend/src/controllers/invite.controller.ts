import {
  acceptInviteSchema,
  createInviteParamsSchema,
  createInviteSchema,
} from '@/schemas/invite.schema.js';
import {
  acceptInviteService,
  createInviteService,
} from '@/services/invite.service.js';
import { Reply, Req } from '@/types/fastify.types.js';

export const createInviteController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const { id } = createInviteParamsSchema.parse(req.params);
  const { email, role, expiresInDays } = createInviteSchema.parse(req.body);

  const invite = await createInviteService(
    userId,
    id,
    email,
    role,
    expiresInDays,
  );

  return res.status(201).send({
    success: true,
    message: 'Convite criado/atualizado com sucesso',
    data: {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
      token: invite.token,
    },
  });
};

export const acceptInviteController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const email = req.user!.email;
  const { token } = acceptInviteSchema.parse(req.body);

  const result = await acceptInviteService(userId, email, token);

  return res.status(200).send({
    success: true,
    message: result.message,
    data: {
      companyId: result.companyId,
    },
  });
};
