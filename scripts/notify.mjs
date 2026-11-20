export function getChanges(sites, checks, previousChecks = []) {
  const changes = []

  for (const check of checks) {
    const site = sites.find((item) => item.id === check.id)
    if (!site) continue
    const previous = previousChecks.find((item) => item.id === check.id)
    if (previous && check.ok !== previous.ok) changes.push({ site, check })
  }
  return changes
}

export async function notifyChanges(sites, checks, previousChecks = []) {
  const changes = getChanges(sites, checks, previousChecks)

  if (changes.length === 0) {
    console.log('Изменений нет, сообщение не отправлено')
    return
  }

  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Секреты Telegram не заданы, сообщение не отправлено')
    return
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `Ночная проверка сайтов\n\n${changes.map(({ site, check }) => check.ok
      ? `🟢 Снова работает: ${site.name}\n${site.url}`
      : `🔴 Не открывается: ${site.name} · ${check.status || check.error}\n${site.url}`).join('\n\n')}` }),
  })
  if (!response.ok) throw new Error(`Telegram: ошибка ${response.status}`)
  console.log('Telegram:', response.status)
}
