import { formatISO } from 'date-fns';

type InputValue = Date | string | number | null;

export function fToApiDate(date: InputValue) {
  return date ? formatISO(new Date(date)) : '';
}
