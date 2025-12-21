// main.js - 채팅 API 연동 로직

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// 메시지 렌더링 함수
function renderMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.user === 'me' ? 'user' : 'other'}`;
    
    const textDiv = document.createElement('div');
    textDiv.textContent = message.text;
    messageDiv.appendChild(textDiv);
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    const date = new Date(message.timestamp);
    timeDiv.textContent = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    messageDiv.appendChild(timeDiv);
    
    return messageDiv;
}

// 메시지 목록 불러오기 (GET /api/messages)
async function loadMessages() {
    try {
        const response = await fetch('/api/messages');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const messages = await response.json();
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="loading">아직 메시지가 없습니다. 첫 메시지를 보내보세요!</div>';
        } else {
            messages.forEach(message => {
                messagesContainer.appendChild(renderMessage(message));
            });
            
            // 스크롤을 최하단으로 이동
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } catch (error) {
        console.error('메시지 로드 실패:', error);
        messagesContainer.innerHTML = '<div class="loading" style="color: red;">메시지를 불러오는 데 실패했습니다. 서버를 확인해주세요.</div>';
    }
}

// 메시지 전송 (POST /api/messages)
async function sendMessage() {
    const text = messageInput.value.trim();
    
    if (!text) {
        alert('메시지를 입력해주세요!');
        return;
    }
    
    try {
        sendButton.disabled = true;
        sendButton.textContent = '전송 중...';
        
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                user: 'me'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newMessage = await response.json();
        
        // 새 메시지를 화면에 추가
        if (messagesContainer.querySelector('.loading')) {
            messagesContainer.innerHTML = '';
        }
        messagesContainer.appendChild(renderMessage(newMessage));
        
        // 입력창 초기화
        messageInput.value = '';
        
        // 스크롤을 최하단으로 이동
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        sendButton.disabled = false;
        sendButton.textContent = '전송';
        messageInput.focus();
    } catch (error) {
        console.error('메시지 전송 실패:', error);
        alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
        sendButton.disabled = false;
        sendButton.textContent = '전송';
    }
}

// 이벤트 리스너 등록
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 페이지 로드 시 메시지 목록 불러오기
window.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    
    // 5초마다 메시지 목록 갱신 (실시간 채팅 효과)
    setInterval(loadMessages, 5000);
});