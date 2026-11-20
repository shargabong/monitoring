import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <>
      <title>Страница не найдена · Мониторинг сайтов группы</title>
      <h2>Страница не найдена</h2>
      <p>Такой страницы нет.</p>
      <Link to="/">Вернуться к списку сайтов</Link>
    </>
  )
}

export default NotFoundPage
