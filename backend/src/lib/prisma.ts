import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Garante que o Prisma desconecte corretamente ao encerrar
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
