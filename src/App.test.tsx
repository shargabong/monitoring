import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'
import { MonitoringContext, type Monitoring } from './monitoring'

const monitoring: Monitoring = {
  sites: [
    { id: 'git', name: 'Справочник по Git', url: 'https://example.org/git/' },
    { id: 'react', name: 'Справочник по React', url: 'https://example.org/react/' },
  ],
  history: [
    {
      time: '2026-11-12T21:00:00Z',
      checks: [
        { id: 'git', ok: true, status: 200, ms: 340, error: '' },
        { id: 'react', ok: false, status: 404, ms: 120, error: '' },
      ],
    },
    {
      time: '2026-11-11T21:00:00Z',
      checks: [
        { id: 'git', ok: true, status: 200, ms: 310, error: '' },
        { id: 'react', ok: true, status: 200, ms: 290, error: '' },
      ],
    },
  ],
  loading: false,
  error: '',
}

describe('App', () => {
  it('по щелчку на карточке открывает страницу сайта', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MonitoringContext value={monitoring}>
          <App />
        </MonitoringContext>
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('link', { name: /Справочник по React/ }))
    const heading = screen.getByRole('heading', { name: 'Справочник по React' })
    expect(heading).toBeInTheDocument()
    const text = screen.getByText('Открывался в 1 из 2 последних проверок.')
    expect(text).toBeInTheDocument()
    expect(document.title).toBe('Справочник по React · Мониторинг сайтов группы')
  })
})
