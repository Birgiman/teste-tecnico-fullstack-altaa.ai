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
  const data = createInviteSchema.parse(req.body);

  const invite = await createInviteService(userId, id, data);

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
  const data = acceptInviteSchema.parse(req.body);

  const result = await acceptInviteService(userId, email, data);

  return res.status(200).send({
    success: true,
    message: result.message,
    data: {
      companyId: result.companyId,
    },
  });
};
