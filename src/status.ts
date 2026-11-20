import type { Check } from './types'
export function statusText(check?: Check) {
  if (!check) return 'Не проверялся'
  return check.ok ? `Работает · ${check.ms} мс` : `Не открывается · ${check.status || check.error}`
}
