import { loginService, signupService } from '@/services/auth.service.js';
import { Reply, Req } from '@/types/fastify.types.js';
import { getJwtCookieOptions } from '@/utils/cookie.utils.js';

export const signupController = async (req: Req, res: Reply) => {
  const { user, token } = await signupService(req.body);

  res.setCookie('token', token, getJwtCookieOptions());

  return res.status(201).send({
    success: true,
    message: 'Usuário cadastrado com sucesso',
    data: { user },
  });
};

export const loginController = async (req: Req, res: Reply) => {
  const { user, token } = await loginService(req.body);
  res.setCookie('token', token, getJwtCookieOptions());

  return res.status(200).send({
    success: true,
    message: 'Login realizado com sucesso',
    data: { user },
  });
};

export const logoutController = async (req: Req, res: Reply) => {
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
