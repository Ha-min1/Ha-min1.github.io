# Chat Server (Express + MariaDB)

간단한 채팅 서버 실행 가이드입니다.

## 로컬 개발 (Host에 Node/MariaDB가 있는 경우)
1. `server` 디렉토리로 이동
```bash
cd server
npm install
```

2. `.env` 파일을 준비 (예: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) 또는 이미 있는 `.env` 사용

3. 데이터베이스 생성 (로컬 MariaDB 사용 시)
```bash
mysql -u <user> -p -e "CREATE DATABASE IF NOT EXISTS dl_chat;"
```

4. 서버 시작 (개발)
```bash
npm run dev   # nodemon 사용
```

혹은 프로덕션
```bash
npm start     # node server.js
```

## Docker(권장) — 전체 스택 실행
루트에서 `docker-compose`를 사용하면 MariaDB와 Chat 서버를 함께 띄울 수 있습니다.

```bash
docker-compose up --build -d
# 로그 확인
docker-compose logs -f chat-server
```

`docker-compose.yml`은 `mariadb`와 `chat-server` 서비스를 정의하고 있으며, 기본 DB 설정은 다음과 같습니다:
- DB: `dl_chat`
- 사용자: `dl_user`
- 비밀번호: `dl_pass`

자동 시작: 서버 실행 시 MariaDB가 연결되지 않은 상태면 `server`의 시작 스크립트가 `docker-compose`를 사용해 `mariadb` 서비스를 자동으로 띄우려고 시도합니다 (Docker가 설치되어 있어야 함). 실패 시 경고를 출력합니다.

## 헬스체크
서버가 정상 동작하면 다음 엔드포인트가 OK를 반환합니다:
```
GET /_health
```

## API
- `GET /api/messages` - 모든 메시지 조회
- `POST /api/messages` - 메시지 추가
- `DELETE /api/messages/:id` - 메시지 삭제

---

문제가 생기면 `server` 폴더의 터미널 로그와 `docker-compose` 로그를 확인하세요.