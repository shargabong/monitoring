import { NavLink, Route, Routes } from 'react-router'
import { useMonitoring } from './monitoring'
import SitesPage from './pages/SitesPage'
import SitePage from './pages/SitePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
export default function App() {
  const { history, loading, error } = useMonitoring()
  return <>
    <header className="header"><h1>Мониторинг сайтов</h1>
      <p>{history[0] ? `Последняя проверка: ${new Date(history[0].time).toLocaleString('ru')}` : 'Проверок ещё не было'}</p>
      <nav aria-label="Навигация"><NavLink to="/" end>Сайты</NavLink><NavLink to="/about">О проверке</NavLink></nav>
    </header>
    <main className="main">{loading ? <p>Загрузка данных…</p> : error ? <p className="load-error" role="alert">{error}</p> : <Routes>
      <Route path="/" element={<SitesPage />} /><Route path="/site/:id" element={<SitePage />} />
      <Route path="/about" element={<AboutPage />} /><Route path="*" element={<NotFoundPage />} />
    </Routes>}</main>
  </>
}
