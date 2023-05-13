import { format } from 'date-fns';

type InputValue = Date | string | number | null;

export function fToApiDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'yyyy-MM-dd.HH:mm';

  return date ? format(new Date(date), fm) : '';
}
