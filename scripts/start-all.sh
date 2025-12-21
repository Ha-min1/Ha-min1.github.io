#!/usr/bin/env bash
set -euo pipefail

# 루트에서 실행: 프로젝트 전체를 Docker로 빌드하고 실행합니다.
# 사용법: ./scripts/start-all.sh

echo "Building and starting services (docker-compose up --build -d)"
docker-compose up --build -d

echo "Waiting a few seconds for services to be healthy..."
sleep 5

echo "Showing chat-server logs (follow). Use Ctrl-C to exit logs."
docker-compose logs -f chat-server
