이번 프로젝트는 주요 웹사이트를 하나로 묶어 보기 좋게 만드는 데 목적을 둔다.
빠르게 즐겨찾는 사이트로 이동하는 깔끔한 런처. 
PWA 지원, 오프라인 캐시, 홈화면 추가 안내까지 구성.

배포: https://Ha-min1.github.io 

개발자: Hamin (GitHub: https://github.com/Ha-min1)
문의: mailto:johamin3624@naver.com
주요 기능
그리드 형태의 링크 버튼
커스텀 로고 이미지(동일 디렉토리 png/svg) 사용
PWA(홈 화면 추가, 오프라인 로딩) 기본 지원
iOS 설치 가이드 섹션
외부 링크 보안 속성 적용(target _blank + rel noopener)
---

## 개발 상태 및 이후 진행 가이드 (간단 요약)
아래는 현재까지 제가 작업한 내용과, 다른 개발자가 이어서 작업할 때 유용한 정보입니다.

### 현재 상태 요약
- 채팅 서버(Express + MariaDB)는 백엔드로 존재하며 Docker-compose로 전체 스택을 구성했습니다. **프론트엔드의 채팅 UI는 유지보수 및 보안 이유로 현재 `server/public`에서 제거**되어 있으며, 필요 시 `CHAT_SETUP.md`의 지침을 따라 재적용할 수 있습니다.
- MariaDB 컨테이너 자동 시작 및 `server` 시작 시 DB 연결 확인 스크립트(`server/bin/ensure-db.js`) 추가
- DB 초기화 시 기본 시스템 메시지로 시드 삽입 추가
- 프론트엔드를 `server/public/`로 복사하여 서버에서 정적 파일을 제공하도록 구성(채팅 UI는 현재 제외됨)
- Codespace/post-start 자동화(`.devcontainer/devcontainer.json`, `scripts/codespace-poststart.sh`) 추가 — Codespace 시작 시 Docker로 서비스 자동 기동 시도 및 로그 파일 생성

### 빠른 실행(로컬 개발)
1. Docker(권장):
   - 루트에서: `docker-compose up --build -d`
   - 서버 로그: `docker-compose logs -f chat-server`
2. 로컬(노드 직접 실행):
   - `cd server && npm install`
   - `npm run dev` (개발, 자동 재시작)

### Codespace / Devcontainer
- `.devcontainer/devcontainer.json`에 `postStartCommand`로 `./scripts/codespace-poststart.sh`를 추가했습니다. Codespace가 시작될 때 의존성 설치 및 `docker-compose up -d`를 시도합니다.

### 외부에서 접근(임시 공개)
- 데모/테스트용으로는 ngrok 사용 가능: `ngrok http 3000` → 발급된 https URL을 `index.html`의 `<meta name="server-url">` 및 `api-base`에 설정하세요.
- 보안 주의: 공개 서비스라면 인증/Rate limit/DB 비밀번호 등을 반드시 강화하세요.

### 파일/엔트리 포인트
- 서버: `server/server.js` (Express app)
- DB 자동시작 스크립트: `server/bin/ensure-db.js`
- 정적 프론트: `server/public/` (index.html, main.js 등)
- Docker compose: `docker-compose.yml`
- Codespace helper: `scripts/codespace-poststart.sh`

### 테스트 및 디버깅 팁
- 헬스체크: `curl http://localhost:3000/_health` → OK
- GET 메시지: `curl http://localhost:3000/api/messages`
- POST 메시지: `curl -X POST http://localhost:3000/api/messages -H 'Content-Type: application/json' -d '{"text":"hi","user":"tester"}'`
- 로그: `docker-compose logs -f chat-server`

### 다음 권장 작업 (이슈로 만들 것)
1. 인증(로그인) 및 악의적 사용 방지(레이트 리밋) 추가
2. CI에 통합된 E2E 테스트(테스트 페이지를 이용한 메시지 전송/수신 검증)
3. 지속적인 배포(Render/Heroku/Cloud) 또는 유료 ngrok/도메인 설정
4. 프론트엔드 개선: 입력 유효성, 에러 피드백 개선, 접근성 보강

---

원하시면 이 내용을 별도 `CONTRIBUTING.md`로 분리하거나, 각 추천 작업을 GitHub 이슈로 생성해 드리겠습니다.

### 채팅 UI — 프론트엔드 임시 제거 (2025-12-25)
프로젝트에서 채팅 UI를 `server/public/index.html`로부터 임시로 제거했습니다. 채팅 서버(Express + MariaDB)는 계속 존재하며, 프론트엔드 재적용 방법은 아래와 같습니다.

재적용 방법:
1. `server/public/index.html`에 아래 HTML 블록을 원래 위치(사이트 모음 바로 다음)에 다시 삽입합니다.

```html
<section class="chat-section" id="chat-section">
    <h2>채팅</h2>
    <div id="chat-container">
        <div id="messages"></div>
        <div class="input-container">
            <input type="text" id="messageInput" placeholder="메시지를 입력하세요..." />
            <button id="sendButton">전송</button>
        </div>
    </div>
</section>
```

2. 페이지 하단에 `<script src="/main.js"></script>`를 복원합니다.
3. 서버를 실행하고(예: `docker-compose up -d` 또는 `cd server && npm run dev`) 정상 동작을 확인하세요.

더 자세한 서버 설정은 `CHAT_SETUP.md`를 참고하세요. 이 UI는 현재 유지보수 비용을 줄이기 위해 임시 제거되어 있으며, 필요 시 다시 활성화할 수 있습니다.