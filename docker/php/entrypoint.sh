#!/usr/bin/env sh
set -eu

cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ ! -d vendor ]; then
  composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader
fi

php artisan storage:link || true

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force --no-interaction
fi

php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force --no-interaction
fi

if [ "${APP_ENV:-production}" = "production" ]; then
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
fi

exec "$@"
