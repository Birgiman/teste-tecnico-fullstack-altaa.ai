import Fastify from "fastify";

const app = Fastify();

const port = parseInt(process.env.PORT || '4000');
const host = process.env.HOST || '0.0.0.0';

app.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (request, reply) => {
    return { message: 'Backend rodando com Fastify!!!!!!'}
  }
)

app.listen({ port, host }, (err: Error | null, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 - Servidor rodando em ${address}`);
})
