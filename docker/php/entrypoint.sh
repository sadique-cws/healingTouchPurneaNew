#!/usr/bin/env sh
set -eu

cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Ensure stale cached config/routes/services from previous builds can't force wrong DB driver.
rm -f bootstrap/cache/*.php || true

if [ ! -d vendor ]; then
  composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader
fi

php artisan storage:link || true

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force --no-interaction
fi

php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force --no-interaction || true
fi

if [ "${APP_ENV:-production}" = "production" ]; then
  php artisan config:cache || true
  php artisan route:cache || true
  php artisan view:cache || true
fi

exec "$@"
