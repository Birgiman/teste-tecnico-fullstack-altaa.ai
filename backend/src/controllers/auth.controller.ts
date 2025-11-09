import { loginSchema, signupSchema } from '@/schemas/auth.schema.js';
import { loginService, signupService } from '@/services/auth.service.js';
import { getJwtCookieOptions } from '@/utils/cookie.utils.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const signupController = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const data = signupSchema.parse(req.body);
  const { user, token } = await signupService(data);

  res.setCookie('token', token, getJwtCookieOptions());

  return res.status(201).send({
    success: true,
    message: 'Usuário cadastrado com sucesso',
    data: { user },
  });
};

export const loginController = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const data = loginSchema.parse(req.body);
  const { user, token } = await loginService(data);
  res.setCookie('token', token, getJwtCookieOptions());

  return res.status(200).send({
    success: true,
    message: 'Login realizado com sucesso',
    data: { user },
  });
};

export const logoutController = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    res.clearCookie('token');
    return res.status(200).send({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch {
    return res.status(500).send({
      success: false,
      message: 'Erro interno ao fazer logout',
    });
  }
};
