import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import "dotenv/config";
import Fastify from "fastify";

function getEnvVars(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`🔓 - Variável de ambiente ${name} não encontrada`);
  }
  return value;
}

const port = parseInt(getEnvVars('PORT'));
const host = getEnvVars('HOST');
const frontEndUrl = getEnvVars('FRONT_END_URL');
const cookieSecret = getEnvVars('COOKIE_SECRET');

const app = Fastify({ logger: true });

await app.register(fastifyCors, {
  origin: frontEndUrl,
  credentials: true,
})

await app.register(fastifyCookie, {
  secret: cookieSecret,
  parseOptions: {}
})

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({ error: error.message || 'Internal Server Error'})
})

app.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (request, reply) => {
    return { message: 'Backend rodando com Fastify!'}
  }
)

app.listen({ port, host }, (err: Error | null) => {
  if (err) {
    app.log.error(`🔴 - Erro ao iniciar o servidor: ${err.message}`);
    process.exit(1);
  }
  console.log(`🚀 - Servidor rodando em http://${host}:${port}`);
  console.log(`🚧 - Prisma Studio disponível em http://${host}:5555`);
  console.log("🔛 - Ouvindo Front-End em", frontEndUrl);
})
