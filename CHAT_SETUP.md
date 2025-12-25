# Hamin ChatLab — 채팅 시스템 설정 및 실행 가이드

## 프로젝트 개요
**프로젝트명:** Hamin ChatLab — 실시간 채팅 연구  
**설명:** MariaDB와 Express를 사용한 실시간 채팅 시스템의 예제 및 학습용 프로젝트입니다. 지속적으로 기능을 개선하고 문서를 보완하고 있습니다.  
**진행 기간:** 2025-08-26부터 지속적으로 발전 중

## 개발자 소개
**이름:** 호민 (GitHub: Ha-min1)  
**학력:** 숭실대학교 컴퓨터학부 재학 (2025-03-01 ~ 2026-01-21)  
**학력(예정):** 건국대학교(서울) KU자유전공학부 신입학 (2026-01-21 ~)  
**주 언어:** C / C++  
**문제 풀이:** https://www.acmicpc.net/user/johamin3624

## 개요
이 프로젝트는 MariaDB와 Express를 사용한 실시간 채팅 시스템입니다.

## 필수 요구사항
- Node.js (v14 이상)
- MariaDB 또는 MySQL (로컬 또는 원격)
- npm 또는 yarn

## 설치 방법

### 1. 서버 의존성 설치
```bash
cd server
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 다음과 같이 설정하세요:

```env
PORT=3000
DB_HOST=localhost          # MariaDB/MySQL 호스트
DB_USER=root               # 데이터베이스 사용자
DB_PASSWORD=yourpassword   # 데이터베이스 비밀번호
DB_NAME=chat_db            # 사용할 데이터베이스 이름
```

### 3. 데이터베이스 생성 및 초기화
MariaDB/MySQL 클라이언트에서:

```sql
CREATE DATABASE chat_db;
```

서버는 시작 시 자동으로 `messages` 테이블을 생성합니다.

## 실행 방법

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

### 프로덕션 모드
```bash
node server.js
```

### 프론트엔드(별도 호스팅)에서 사용하는 경우
- 프론트엔드를 GitHub Pages 등 다른 호스트에서 제공하면 브라우저의 동일 출처 정책 때문에 `/api/messages` 같은 상대 경로 요청이 실패합니다. 이때는 `index.html`의 `<meta name="api-base" content="http://<서버 호스트>:3000">` 를 설정하거나, 서버에서 정적 파일을 서빙하세요.
- 본 레포에서는 **서버에서 정적 파일(server/public)** 로 프론트를 함께 서빙할 수 있게 되어 있습니다. 서버에서 열면(Codespace/로컬/서버 호스트) 채팅이 바로 작동합니다. (예: http://localhost:3000)


### 프론트엔드(별도 호스팅)에서 사용하는 경우
- 프론트엔드를 GitHub Pages 등 다른 호스트에서 제공하면 브라우저의 동일 출처 정책 때문에 `/api/messages` 같은 상대 경로 요청이 실패합니다. 이때는 `index.html`의 `<meta name="api-base" content="http://<서버 호스트>:3000">` 를 설정하거나, 프록시를 구성하세요.
- 개발 시 로컬 서버로 접근하려면 `index.html`에 다음을 추가하세요:
```html
<meta name="api-base" content="http://localhost:3000">
```


## API 엔드포인트

### GET /api/messages
모든 메시지 조회
```bash
curl http://localhost:3000/api/messages
```

**응답:**
```json
[
  {
    "id": 1,
    "user": "me",
    "text": "안녕하세요!",
    "timestamp": "2025-12-20 10:30:45"
  }
]
```

### POST /api/messages
새 메시지 저장
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"text":"메시지 내용", "user":"me"}'
```

**요청 본문:**
```json
{
  "text": "메시지 내용",
  "user": "me"  // 생략 가능, 기본값: "me"
}
```

**응답:**
```json
{
  "id": 1,
  "user": "me",
  "text": "메시지 내용",
  "timestamp": "2025-12-20 10:30:45"
}
```

### DELETE /api/messages/:id
메시지 삭제
```bash
curl -X DELETE http://localhost:3000/api/messages/1
```

## 프론트엔드 통합

프론트엔드는 자동으로 다음 엔드포인트와 연동됩니다:
- GET `/api/messages` - 메시지 목록 로드 (5초마다 자동 갱신)
- POST `/api/messages` - 새 메시지 전송

## 데이터베이스 스키마

### messages 테이블
```sql
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50) NOT NULL DEFAULT 'user',
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 문제 해결

### 데이터베이스 연결 실패
- MariaDB/MySQL 서비스 실행 확인
- `.env` 파일의 호스트, 사용자, 비밀번호 확인
- 데이터베이스가 존재하는지 확인

### 포트 이미 사용 중
다른 포트로 실행:
```bash
PORT=3001 npm start
```

### 메시지 로드 실패
- 서버가 실행 중인지 확인
- 브라우저 콘솔에서 오류 메시지 확인
- 네트워크 탭에서 API 응답 확인

## 배포 시 주의사항
- 프로덕션 환경에서는 `.env` 파일을 환경 변수로 관리하세요
- 데이터베이스 백업을 정기적으로 수행하세요
- HTTPS를 사용하세요
- CORS 설정을 필요에 따라 조정하세요

## 라이센스
MIT
