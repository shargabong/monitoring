# Мониторинг сайтов

Список сайтов лежит в public/data/sites.json. Скрипт проверяет адреса и сохраняет последние 30 результатов в public/data/results.json.

Для запуска: npm install, затем node scripts/check.mjs и npm run dev.

Для публикации нужен отдельный репозиторий monitoring. В настройках Pages нужно выбрать GitHub Actions. Проверка работает по расписанию и запускается вручную через Actions.

Для оповещений добавьте в секреты репозитория TELEGRAM_TOKEN и TELEGRAM_CHAT_ID. Бот сообщает об изменении доступности сайта.
