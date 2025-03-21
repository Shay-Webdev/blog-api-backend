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
        throw new NotFoundError(entity);
      default:
        throw new DatabaseError(
          `Database operation failed: ${error.message}`,
          error.code
        );
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseError(
      `Database operation failed: ${error.message}`,
      'DATABASE_VALIDATION_ERROR'
    );
  }
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new DatabaseError(
      `Database operation failed: ${error.message}`,
      'DATABASE_UNKNOWN_ERROR'
    );
  }

  throw new DatabaseError(`Unexpected database error: ${error}`);
}
