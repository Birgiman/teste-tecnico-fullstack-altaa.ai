import { prisma } from '@/lib/prisma.js';
import { loginSchema, signupSchema } from '@/schemas/auth.schema.js';
import { createAppError } from '@/utils/app-error.util.js';
import { generateJwtToken } from '@/utils/jwt.utils.js';
import bcrypt from 'bcrypt';

export const signupService = async (data: unknown) => {
  const validatedData = signupSchema.parse(data);
  const { name, email, password } = validatedData;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw createAppError('USER_ALREADY_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateJwtToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const loginService = async (data: unknown) => {
  const validatedData = loginSchema.parse(data);
  const { email, password } = validatedData;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw createAppError('INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createAppError('INVALID_CREDENTIALS');
  }

  const token = generateJwtToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
