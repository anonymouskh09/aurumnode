# Aurum Node - Deployment Guide

Target: Ubuntu + Nginx + PHP-FPM + MySQL

## 1. Server setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd mysql-server redis-server supervisor
```

## 2. Clone and configure

```bash
cd /var/www
sudo git clone <repo-url> aurum-node
cd aurum-node
sudo chown -R www-data:www-data .
```

## 3. Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://yourdomain.com`
- `DB_CONNECTION=mysql` (set DB_*)
- `CACHE_STORE=redis`
- `QUEUE_CONNECTION=redis`
- `SESSION_DRIVER=database`

## 4. Dependencies

```bash
composer install --optimize-autoloader --no-dev
npm ci && npm run build
```

## 5. Database

```bash
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
```

## 6. Permissions

```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

## 7. Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/aurum-node/public;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    index index.php;
    charset utf-8;
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 8. Supervisor (queue workers)

Create `/etc/supervisor/conf.d/aurum-node.conf`:

```ini
[program:aurum-node-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/aurum-node/artisan queue:work redis --sleep=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/aurum-node/storage/logs/worker.log
```

```bash
sudo supervisorctl reread && sudo supervisorctl update
```

## 9. Cron (scheduler)

```bash
crontab -e
```

Add:
```
* * * * * cd /var/www/aurum-node && php artisan schedule:run >> /dev/null 2>&1
```

## 10. SSL (optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```