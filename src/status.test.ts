import { describe, expect, it } from 'vitest'
import { statusText } from './status'

describe('statusText', () => {
  it('сайт ещё не проверялся', () => {
    expect(statusText(undefined)).toBe('Не проверялся')
  })

  it('сайт работает', () => {
    const check = { id: 'git', ok: true, status: 200, ms: 340, error: '' }
    expect(statusText(check)).toBe('Работает · 340 мс')
  })

  it('сервер ответил ошибкой', () => {
    const check = { id: 'git', ok: false, status: 404, ms: 120, error: '' }
    expect(statusText(check)).toBe('Не открывается · 404')
  })

  it('сервер не ответил', () => {
    const check = { id: 'git', ok: false, status: 0, ms: 15000, error: 'timeout' }
    expect(statusText(check)).toBe('Не открывается · timeout')
  })
})
