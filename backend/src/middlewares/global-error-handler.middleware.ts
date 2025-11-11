import { ErrorMessages, HttpStatusCode } from '@/types/error.types.js';
import { FastifyErr, Reply, Req } from '@/types/fastify.types.js';
import { AppError } from '@/utils/app-error.util.js';
import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

export const setupGlobalErrorHandler = (app: FastifyInstance) => {
  app.setErrorHandler((error: FastifyErr, req: Req, reply: Reply) => {
    try {
      const errorCause = error.cause as {
        name?: string;
        issues?: unknown;
        constructor?: { name?: string };
      } | null;

      const isZodError =
        error instanceof ZodError ||
        error.name === 'ZodError' ||
        errorCause?.name === 'ZodError' ||
        errorCause instanceof ZodError ||
        error.validation !== undefined ||
        (error as { issues?: unknown }).issues !== undefined;

      if (isZodError) {
        const zodError =
          error instanceof ZodError
            ? error
            : errorCause instanceof ZodError
              ? errorCause
              : (errorCause as unknown as ZodError) ||
                (error as unknown as ZodError);

        const statusCode =
          (error.statusCode as HttpStatusCode) ?? HttpStatusCode.BAD_REQUEST;

        const issues = zodError.issues || error.validation || [];

        // Extrai apenas as mensagens dos issues
        const errorMessages: string[] = [];
        let validationMessage: string =
          ErrorMessages[HttpStatusCode.BAD_REQUEST];

        if (Array.isArray(issues) && issues.length > 0) {
          issues.forEach((issue) => {
            if (
              issue &&
              typeof issue === 'object' &&
              'message' in issue &&
              typeof issue.message === 'string'
            ) {
              errorMessages.push(issue.message);
            }
          });

          // Usa a primeira mensagem como mensagem principal
          if (errorMessages.length > 0) {
            validationMessage = errorMessages[0];
          }
        }

        return reply.status(statusCode).send({
          success: false,
          statusCode,
          message: validationMessage,
        });
      }

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          statusCode: error.statusCode,
          message: error.message,
        });
      }

      const statusCode =
        (error.statusCode as HttpStatusCode) ??
        HttpStatusCode.INTERNAL_SERVER_ERROR;

      return reply.status(statusCode).send({
        success: false,
        statusCode,
        message:
          error.message || ErrorMessages[HttpStatusCode.INTERNAL_SERVER_ERROR],
      });
    } catch {
      return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        success: false,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: ErrorMessages[HttpStatusCode.INTERNAL_SERVER_ERROR],
      });
    }
  });
};
