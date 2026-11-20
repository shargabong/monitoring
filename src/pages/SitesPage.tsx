import { useState } from 'react'
import { Link } from 'react-router'
import { useMonitoring } from '../monitoring'
import { sitesWord } from '../plural'
import { statusText } from '../status'

function SitesPage() {
  const { sites, history, loading, error } = useMonitoring()
  const [query, setQuery] = useState('')
  const [onlyDown, setOnlyDown] = useState(false)

  if (loading) {
    return (
      <p className="empty" role="status">
        Загрузка результатов…
      </p>
    )
  }

  if (error !== '') {
    return (
      <p className="load-error" role="alert">
        {error}
      </p>
    )
  }

  const last = history[0]
  const down = sites.filter(
    (site) => !last?.checks.find((c) => c.id === site.id)?.ok,
  ).length

  let summary = `Все ${sites.length} ${sitesWord(sites.length)} открываются`
  if (last === undefined) {
    summary = 'Проверок ещё не было'
  } else if (down > 0) {
    summary = `Не открываются: ${down} из ${sites.length}`
  }

  const shown = sites.filter((site) => {
    const ok = last?.checks.find((c) => c.id === site.id)?.ok
    return (
      site.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (!onlyDown || !ok)
    )
  })

  return (
    <>
      <title>Сайты · Мониторинг сайтов группы</title>
      <p
        className={
          last !== undefined && down > 0 ? 'summary summary--bad' : 'summary'
        }
      >
        {summary}
      </p>
      <div className="filters">
        <label>
          Поиск по названию
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={onlyDown}
            onChange={(e) => setOnlyDown(e.target.checked)}
          />
          Только неработающие
        </label>
      </div>
      {shown.length === 0 && <p className="empty">Сайтов не найдено</p>}
      <div className="sites">
        {shown.map((site) => {
          const check = last?.checks.find((c) => c.id === site.id)
          return (
            <Link
              key={site.id}
              to={`/site/${site.id}`}
              className={check?.ok ? 'site' : 'site site--bad'}
            >
              <h2>{site.name}</h2>
              <span className="site__status">{statusText(check)}</span>
              <span className="site__url">{site.url}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default SitesPage
