import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { MonitoringContext, type Monitoring } from '../monitoring'
import type { Run, Site } from '../types'
import SitesPage from './SitesPage'

const sites: Site[] = [
  { id: 'git', name: 'Справочник по Git', url: 'https://example.org/git/' },
  { id: 'react', name: 'Справочник по React', url: 'https://example.org/react/' },
  { id: 'sql', name: 'Задачник по SQL', url: 'https://example.org/sql/' },
]

const run: Run = {
  time: '2026-11-12T21:00:00Z',
  checks: [
    { id: 'git', ok: true, status: 200, ms: 340, error: '' },
    { id: 'react', ok: false, status: 404, ms: 120, error: '' },
    { id: 'sql', ok: true, status: 200, ms: 510, error: '' },
  ],
}

function show(monitoring: Partial<Monitoring>) {
  const value: Monitoring = {
    sites,
    history: [run],
    loading: false,
    error: '',
    ...monitoring,
  }
  render(
    <MemoryRouter>
      <MonitoringContext value={value}>
        <SitesPage />
      </MonitoringContext>
    </MemoryRouter>,
  )
}

describe('SitesPage', () => {
  it('считает сайты, которые не открываются', () => {
    show({})
    expect(screen.getByText('Не открываются: 1 из 3')).toBeInTheDocument()
  })

  it('ведёт на страницу сайта', () => {
    show({})
    const link = screen.getByRole('link', { name: /Справочник по React/ })
    expect(link).toHaveAttribute('href', '/site/react')
  })

  it('пока идёт загрузка, сообщает об этом', () => {
    show({ loading: true })
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка результатов…')
  })

  it('название карточки начинается с названия сайта', () => {
    show({})
    const link = screen.getByRole('link', { name: /^Справочник по React/ })
    expect(link).toBeInTheDocument()
  })

  it('все сайты открываются', () => {
    show({ history: [{ ...run, checks: run.checks.map((c) => ({ ...c, ok: true })) }] })
    expect(screen.getByText('Все 3 сайта открываются')).toBeInTheDocument()
  })

  it('проверок ещё не было', () => {
    show({ history: [] })
    expect(screen.queryByText(/Не открываются/)).not.toBeInTheDocument()
  })

  it('поиск react оставляет одну карточку', async () => {
    const user = userEvent.setup()
    show({})
    await user.type(screen.getByLabelText('Поиск по названию'), 'react')
    expect(screen.getByText('Справочник по React')).toBeInTheDocument()
    expect(screen.queryByText('Справочник по Git')).not.toBeInTheDocument()
    expect(screen.queryByText('Задачник по SQL')).not.toBeInTheDocument()
  })

  it('флажок Только неработающие оставляет одну карточку', async () => {
    const user = userEvent.setup()
    show({})
    await user.click(screen.getByLabelText('Только неработающие'))
    expect(screen.getByText('Справочник по React')).toBeInTheDocument()
    expect(screen.queryByText('Справочник по Git')).not.toBeInTheDocument()
    expect(screen.queryByText('Задачник по SQL')).not.toBeInTheDocument()
  })

  it('поиск git с флажком показывает Сайтов не найдено', async () => {
    const user = userEvent.setup()
    show({})
    await user.type(screen.getByLabelText('Поиск по названию'), 'git')
    await user.click(screen.getByLabelText('Только неработающие'))
    expect(screen.getByText('Сайтов не найдено')).toBeInTheDocument()
  })
})
