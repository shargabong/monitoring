import { useEffect, useState, type ReactNode } from 'react'
import { MonitoringContext, type Monitoring } from './monitoring'
import type { Site, Run } from './types'

async function loadJson<T>(name: string): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`)
  if (!response.ok) {
    throw new Error(`Файл ${name} не загрузился: код ${response.status}.`)
  }
  return response.json()
}

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Monitoring>({
    sites: [],
    history: [],
    loading: true,
    error: '',
  })

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [sites, results] = await Promise.all([
          loadJson<Site[]>('sites.json'),
          loadJson<{ history: Run[] }>('results.json'),
        ])
        if (active) {
          setState({ sites, history: results.history, loading: false, error: '' })
        }
      } catch (e) {
        if (active) {
          setState({ sites: [], history: [], loading: false, error: (e as Error).message })
        }
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  return (
    <MonitoringContext value={state}>
      {children}
    </MonitoringContext>
  )
}

export default MonitoringProvider
