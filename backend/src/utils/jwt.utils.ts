import 'dotenv/config';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`🔓 - Variável de ambiente "${name}" não encontrada`);
  }
  return value;
}

const JWT_SECRET: Secret = getEnvVar('JWT_SECRET');
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = getEnvVar(
  'JWT_EXPIRES_IN',
) as SignOptions['expiresIn'];

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateJwtToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    throw new Error('Token inválido');
  }
};
