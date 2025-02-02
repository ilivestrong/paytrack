import { QueryFailedError } from 'typeorm';
import * as dayjs from 'dayjs';

export function isDuplicateError(error: Error): boolean {
  return testDBError(error, 'duplicate key value');
}

export function isNotNullViolationError(error: Error): boolean {
  return testDBError(error, 'violates not-null constraint');
}

function testDBError(error: Error, type: string) {
  if (error instanceof QueryFailedError) {
    return error.message.includes(type);
  }
  return false;
}

export function isForeignKeyViolationError(error: Error): boolean {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError).message.includes(
      'violates foreign key constraint',
    )
  );
}

export enum DATE_REFERNCE {
  YESTERDAY,
  TODAY,
  TOMORROW,
}

/**
 * Gets a date in 'YYYY-MM-DD' format based on DATE_REFERENCE enum passed
 * If TODAY passed, then it retuns today's date.
 * If YESTERDAY is passed, it returns yesterday's date.
 * If TOMORROW is passed, it returns tomorrow's date.
 * Default / no argument it returns today's date.
 */
export function getDate(reference = DATE_REFERNCE.TODAY) {
  const dateOperations = {
    [DATE_REFERNCE.YESTERDAY]: () => dayjs().subtract(1, 'day'),
    [DATE_REFERNCE.TOMORROW]: () => dayjs().add(1, 'day'),
    [DATE_REFERNCE.TODAY]: () => dayjs(),
  };

  const selectedDate =
    dateOperations[reference] || dateOperations[DATE_REFERNCE.TODAY];

  return selectedDate().format('YYYY-MM-DD');
}

export enum QUEUE_NAME {
  MONTHLY_USERS = 'monthly_users',
  DAILY_USERS = 'daily_users',
}
