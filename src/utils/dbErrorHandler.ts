import { Prisma } from '@prisma/client';
import {
  DatabaseError,
  UniqueConstraintError,
  NotFoundError,
} from '../models/errors.js';

export function handleDbError(
  error: unknown,
  entity: string = 'Resource'
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        const field = (error.meta?.target as string[])?.[0] || 'field';
        throw new UniqueConstraintError(field);
      case 'P2025': // Record not found (e.g., update/delete)
        throw new NotFoundError();
      default:
        throw new DatabaseError(`Prisma error`, 'prisma_error');
    }
  }
  // if (error instanceof Prisma.PrismaClientValidationError) {
  //   throw new DatabaseError(
  //     `Database operation failed: ${error.message}`,
  //     'DATABASE_VALIDATION_ERROR'
  //   );
  // }
  // if (error instanceof Prisma.PrismaClientUnknownRequestError) {
  //   throw new DatabaseError(
  //     `Database operation failed: ${error.message}`,
  //     'DATABASE_UNKNOWN_ERROR'
  //   );
  // }
  console.log('instance of db Error in handleDbError:', error);

  throw new DatabaseError(
    `Internal server error`,
    'internal_server_error',
    error
  );
}
