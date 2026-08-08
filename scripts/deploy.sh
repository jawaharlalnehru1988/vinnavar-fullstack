#!/bin/bash
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
    BRANCH="master"
fi

echo "=== [1/5] Pulling latest changes from Git (branch: $BRANCH) ==="
cd /var/www/vinnavar-fullstack
git pull origin "$BRANCH" --rebase --autostash || true

echo "=== [2/5] Building Spring Boot Backend ==="
cd /var/www/vinnavar-fullstack/vinnavar-backend
mvn clean package -DskipTests

echo "=== [3/5] Restarting vinnavar-backend Service ==="
sudo systemctl restart vinnavar-backend || systemctl restart vinnavar-backend

echo "=== [4/5] Building React Frontend ==="
cd /var/www/vinnavar-fullstack/vinnavar-frontend
npm install
npm run build

echo "=== [5/5] Reloading Nginx ==="
sudo systemctl reload nginx || systemctl reload nginx

echo "=== Deployment Completed Successfully! ==="
