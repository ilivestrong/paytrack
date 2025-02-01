import { QueryFailedError } from 'typeorm';

export function isDuplicateError(error: Error): boolean {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError).message.includes('duplicate key value')
  );
}

export function isNotNullViolationError(error: Error): boolean {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError).message.includes('violates not-null constraint')
  );
}

export function isForeignKeyViolationError(error: Error): boolean {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError).message.includes(
      'violates foreign key constraint',
    )
  );
}
