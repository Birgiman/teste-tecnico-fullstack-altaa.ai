import { setupGlobalErrorHandler } from '@/middlewares/global-error-handler.middleware.js';
import { registerPublicRoutes } from '@/routes/public.routes.index.js';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import 'dotenv/config';
import { fastify } from 'fastify';
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import protectedRoutesIndex from './routes/protected.routes.index.js';

function getEnvVars(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`🔓 - Variável de ambiente "${name}" não encontrada`);
  }
  return value;
}

const port = parseInt(getEnvVars('PORT'));
const host = getEnvVars('HOST');
const frontEndUrl = getEnvVars('FRONT_END_URL');
const cookieSecret = getEnvVars('COOKIE_SECRET');
const isDev = getEnvVars('NODE_ENV') !== 'production';

const app = fastify({
  logger: isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'hostname,pid,time',
            errorProps: 'message',
            translateTime: 'HH:MM:ss',
          },
        },
      }
    : true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

setupGlobalErrorHandler(app);

await app.register(fastifyCors, {
  origin: ['*'],
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

await registerPublicRoutes(app);

await app.register(protectedRoutesIndex);

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
