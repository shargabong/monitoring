import { Link, useParams } from 'react-router'
import { useMonitoring } from '../monitoring'
import { statusText } from '../status'

function SitePage() {
  const { id } = useParams()
  const { sites, history, loading } = useMonitoring()

  if (loading) {
    return (
      <p className="empty" role="status">
        Загрузка результатов…
      </p>
    )
  }

  const site = sites.find((s) => s.id === id)
  if (site === undefined) {
    return (
      <>
        <title>Сайт не найден · Мониторинг сайтов группы</title>
        <p className="empty">Сайт не найден в списке.</p>
        <Link to="/" className="back">← К списку сайтов</Link>
      </>
    )
  }

  const siteChecks = history.flatMap((run) => {
    const check = run.checks.find((c) => c.id === site.id)
    return check ? [{ time: run.time, ...check }] : []
  })

  const okCount = siteChecks.filter((c) => c.ok).length

  return (
    <>
      <title>{`${site.name} · Мониторинг сайтов группы`}</title>
      <Link to="/" className="back">
        ← Все сайты
      </Link>
      <h2>{site.name}</h2>
      <p className="site-details-url">
        <a href={site.url} target="_blank" rel="noreferrer">
          {site.url}
        </a>
      </p>
      <p>
        {siteChecks.length === 0
          ? 'Проверок этого сайта ещё не было.'
          : `Открывался в ${okCount} из ${siteChecks.length} последних проверок.`}
      </p>
      {siteChecks.length > 0 && (
        <div className="table-wrap">
          <table>
            <caption>История проверок</caption>
            <thead>
              <tr>
                <th>Время проверки</th>
                <th>Состояние</th>
                <th>Время ответа</th>
              </tr>
            </thead>
            <tbody>
              {siteChecks.map((check, index) => (
                <tr key={index} className={check.ok ? '' : 'row--bad'}>
                  <td>{new Date(check.time).toLocaleString('ru')}</td>
                  <td>{statusText(check)}</td>
                  <td>{check.ms ? `${check.ms} мс` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default SitePage
