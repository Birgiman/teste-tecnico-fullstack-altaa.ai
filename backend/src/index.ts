import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import 'dotenv/config';
import { fastify } from 'fastify';
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

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

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyCors, {
  origin: frontEndUrl,
  credentials: true, //envia cookies automaticamente
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

await app.register(fastifyCookie, {
  secret: cookieSecret,
  parseOptions: {},
});

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Altaa.ai Multitenant API',
      description: 'API para o projeto Altaa.ai Multitenant',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

await app.register(ScalarApiReference, {
  routePrefix: '/docs',
});

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({ error: error.message || 'Internal Server Error' });
});

app.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (request, reply) => {
    return { message: 'Backend rodando com Fastify!' };
  },
);

app.listen({ port, host }, (err: Error | null) => {
  if (err) {
    app.log.error(`🔴 - Erro ao iniciar o servidor: ${err.message}`);
    process.exit(1);
  }
  console.log(`🚀 - Servidor rodando em http://${host}:${port}`);
  console.log(`🚧 - Prisma Studio disponível em http://${host}:5555`);
  console.log(`📚 - Documentação disponível em http://${host}:${port}/docs`);
  console.log('🔛 - Ouvindo Front-End em', frontEndUrl);
});
