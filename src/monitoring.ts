import { createContext, useContext } from 'react'
import type { Site, Run } from './types'

export type Monitoring = {
  sites: Site[]
  history: Run[]
  loading: boolean
  error: string
}

export type MonitoringState = Monitoring

export const MonitoringContext = createContext<Monitoring>({
  sites: [],
  history: [],
  loading: true,
  error: '',
})

export function useMonitoring() {
  const value = useContext(MonitoringContext)
  if (!value) {
    throw new Error('useMonitoring вызван вне MonitoringProvider')
  }
  return value
}
