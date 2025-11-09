import type { CookieSerializeOptions } from '@fastify/cookie';

// Converte string '7d' para segundos
const parseDuration = (duration: string): number => {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1));

  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * (units[unit] || 1);
};

export const getJwtCookieOptions = (): CookieSerializeOptions => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: parseDuration(expiresIn),
  };
};
