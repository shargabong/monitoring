import { readFile, writeFile } from 'node:fs/promises'
import { notifyChanges } from './notify.mjs'

const SITES = 'public/data/sites.json'
const RESULTS = 'public/data/results.json'

const sites = JSON.parse(await readFile(SITES, 'utf8'))
let history = []
try {
  history = JSON.parse(await readFile(RESULTS, 'utf8')).history
} catch {
  // Первый запуск: файла с результатами ещё нет.
}

const checks = []
for (const site of sites) {
  const check = { id: site.id, ok: false, status: 0, ms: 0, error: '' }
  const start = Date.now()
  try {
    const response = await fetch(site.url, { signal: AbortSignal.timeout(15000) })
    check.status = response.status
    check.ok = response.ok
  } catch (e) {
    check.error = e.message
  }
  check.ms = Date.now() - start
  console.log(`${check.ok ? 'OK  ' : 'FAIL'} ${check.status} ${check.ms} мс ${site.url}`)
  checks.push(check)
}

const previousChecks = history[0]?.checks ?? []
history = [{ time: new Date().toISOString(), checks }, ...history].slice(0, 30)
await writeFile(RESULTS, JSON.stringify({ history }, null, 2) + '\n')
await notifyChanges(sites, checks, previousChecks)
