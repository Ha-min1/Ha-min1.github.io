#!/usr/bin/env bash
set -euo pipefail

# Codespace/Post-start script: 설치 & DB/서버 자동 시작
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "Installing server dependencies..."
npm --prefix server ci || true

# Try to start mariadb and chat-server via docker-compose
if command -v docker-compose >/dev/null 2>&1 || (command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1); then
  echo "Starting MariaDB and chat-server via docker-compose..."
  docker-compose up -d || docker compose up -d
  mkdir -p logs
  # Redirect logs to file so user can inspect easily
  docker-compose logs -f chat-server > logs/chat-server.log 2>&1 &
  echo "Logs are being written to logs/chat-server.log"
else
  echo "Docker/docker-compose not available; skipping container start. You can run './scripts/start-all.sh' manually."
fi

echo "Codespace post-start tasks complete."