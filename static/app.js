// 상태 관리
let state = {
    messages: [],
    isLoading: false,
    settings: {
        apiKey: '',
        partnerName: '유키',
        difficulty: 'beginner',
        topic: 'free',
        showTranslation: true,
        showFurigana: true
    }
};

// DOM 요소
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const settingsModal = document.getElementById('settingsModal');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadMessages();
    
    // 자동 높이 조절
    messageInput.addEventListener('input', autoResize);
});

function autoResize() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// 설정 로드
function loadSettings() {
    const saved = localStorage.getItem('nihongoSettings');
    if (saved) {
        state.settings = { ...state.settings, ...JSON.parse(saved) };
    }
    applySettingsToUI();
}

// 설정 UI에 적용
function applySettingsToUI() {
    document.getElementById('apiKey').value = state.settings.apiKey;
    document.getElementById('partnerName').value = state.settings.partnerName;
    document.getElementById('showTranslation').checked = state.settings.showTranslation;
    document.getElementById('showFurigana').checked = state.settings.showFurigana;
    
    // 난이도 버튼
    document.querySelectorAll('.segment').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === state.settings.difficulty);
    });
    
    // 주제 버튼
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === state.settings.topic);
    });
}

// 설정 저장
function saveSettings() {
    state.settings = {
        apiKey: document.getElementById('apiKey').value,
        partnerName: document.getElementById('partnerName').value || '유키',
        difficulty: document.querySelector('.segment.active').dataset.value,
        topic: document.querySelector('.topic-btn.active').dataset.value,
        showTranslation: document.getElementById('showTranslation').checked,
        showFurigana: document.getElementById('showFurigana').checked
    };
    
    localStorage.setItem('nihongoSettings', JSON.stringify(state.settings));
    toggleSettings();
    
    // 파트너 이름이 바뀌었으면 환영 메시지 갱신
    if (state.messages.length === 0) {
        addWelcomeMessage();
    }
}

// 메시지 로드
function loadMessages() {
    const saved = localStorage.getItem('nihongoMessages');
    if (saved) {
        state.messages = JSON.parse(saved);
        renderMessages();
    } else {
        addWelcomeMessage();
    }
}

// 메시지 저장
function saveMessages() {
    localStorage.setItem('nihongoMessages', JSON.stringify(state.messages));
}

// 환영 메시지 추가
function addWelcomeMessage() {
    const welcomeMessages = [
        `こんにちは！私は${state.settings.partnerName}です。日本語の練習、一緒に頑張りましょう！😊`,
        `やあ！${state.settings.partnerName}だよ。今日は何を話そうか？🌸`,
        `はじめまして！${state.settings.partnerName}です。気軽に話しかけてね！✨`
    ];
    
    const message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
        timestamp: new Date().toISOString()
    };
    
    state.messages = [message];
    saveMessages();
    renderMessages();
}

// 메시지 렌더링
function renderMessages() {
    messagesContainer.innerHTML = state.messages.map(msg => createMessageHTML(msg)).join('');
    scrollToBottom();
}

// 메시지 HTML 생성
function createMessageHTML(message) {
    const isUser = message.role === 'user';
    const time = new Date(message.timestamp).toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    if (isUser) {
        return `
            <div class="message user">
                <div class="bubble-container">
                    <div class="bubble">${escapeHTML(message.content)}</div>
                    <span class="timestamp">${time}</span>
                </div>
            </div>
        `;
    } else {
        const hasDetails = message.translation || message.furigana;
        const canShowDetails = state.settings.showTranslation || state.settings.showFurigana;
        
        return `
            <div class="message assistant">
                <div class="avatar">🇯🇵</div>
                <div class="bubble-container">
                    <div class="bubble" onclick="toggleDetails('${message.id}')">
                        ${escapeHTML(message.content)}
                        <div class="bubble-details" id="details-${message.id}" ${hasDetails ? '' : ''}>
                            ${message.furigana && state.settings.showFurigana ? `
                                <div class="detail-section">
                                    <div class="detail-label">📖 읽는 법</div>
                                    <div class="detail-text">${escapeHTML(message.furigana)}</div>
                                </div>
                            ` : ''}
                            ${message.translation && state.settings.showTranslation ? `
                                <div class="detail-section">
                                    <div class="detail-label">🇰🇷 번역</div>
                                    <div class="detail-text">${escapeHTML(message.translation)}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    ${canShowDetails ? '<span class="tap-hint">클릭하여 번역 보기</span>' : ''}
                    <span class="timestamp">${time}</span>
                </div>
            </div>
        `;
    }
}

// HTML 이스케이프
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 상세 정보 토글
async function toggleDetails(messageId) {
    const details = document.getElementById(`details-${messageId}`);
    if (!details) return;
    
    // 이미 열려있으면 닫기
    if (details.classList.contains('show')) {
        details.classList.remove('show');
        return;
    }
    
    // 메시지 찾기
    const message = state.messages.find(m => m.id === messageId);
    if (!message) return;
    
    // 번역/후리가나가 없으면 가져오기
    const needsTranslation = state.settings.showTranslation && !message.translation;
    const needsFurigana = state.settings.showFurigana && !message.furigana;
    
    if (needsTranslation || needsFurigana) {
        // 로딩 표시
        details.innerHTML = '<div class="detail-section"><div class="detail-text">로딩 중...</div></div>';
        details.classList.add('show');
        
        // 번역 가져오기
        if (needsTranslation && state.settings.apiKey) {
            try {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: message.content,
                        api_key: state.settings.apiKey
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    message.translation = data.translation;
                }
            } catch (e) {
                console.error('Translation failed:', e);
            }
        }
        
        // 후리가나 가져오기
        if (needsFurigana && state.settings.apiKey) {
            try {
                const res = await fetch('/api/furigana', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: message.content,
                        api_key: state.settings.apiKey
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    message.furigana = data.furigana;
                }
            } catch (e) {
                console.error('Furigana failed:', e);
            }
        }
        
        // 메시지 저장 및 다시 렌더링
        saveMessages();
        
        // 상세 정보 업데이트
        details.innerHTML = `
            ${message.furigana && state.settings.showFurigana ? `
                <div class="detail-section">
                    <div class="detail-label">📖 읽는 법</div>
                    <div class="detail-text">${escapeHTML(message.furigana)}</div>
                </div>
            ` : ''}
            ${message.translation && state.settings.showTranslation ? `
                <div class="detail-section">
                    <div class="detail-label">🇰🇷 번역</div>
                    <div class="detail-text">${escapeHTML(message.translation)}</div>
                </div>
            ` : ''}
        `;
    }
    
    details.classList.add('show');
}

// 타이핑 인디케이터
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="avatar">🇯🇵</div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// 스크롤
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 메시지 전송
async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || state.isLoading) return;
    
    if (!state.settings.apiKey) {
        alert('OpenAI API 키를 설정해주세요.');
        toggleSettings();
        return;
    }
    
    // 사용자 메시지 추가
    const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content,
        timestamp: new Date().toISOString()
    };
    
    state.messages.push(userMessage);
    saveMessages();
    renderMessages();
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // AI 응답 요청
    state.isLoading = true;
    sendBtn.disabled = true;
    showTypingIndicator();
    
    try {
        // 대화 히스토리 구성
        const history = state.messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: content,
                history: history.slice(0, -1),
                api_key: state.settings.apiKey,
                partner_name: state.settings.partnerName,
                difficulty: state.settings.difficulty,
                topic: state.settings.topic
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || '오류가 발생했습니다.');
        }
        
        const data = await response.json();
        
        // AI 메시지 생성
        const assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.response,
            timestamp: new Date().toISOString()
        };
        
        // 번역 가져오기
        if (state.settings.showTranslation) {
            try {
                const transRes = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: data.response,
                        api_key: state.settings.apiKey
                    })
                });
                if (transRes.ok) {
                    const transData = await transRes.json();
                    assistantMessage.translation = transData.translation;
                }
            } catch (e) {
                console.error('Translation failed:', e);
            }
        }
        
        // 후리가나 가져오기
        if (state.settings.showFurigana) {
            try {
                const furiRes = await fetch('/api/furigana', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: data.response,
                        api_key: state.settings.apiKey
                    })
                });
                if (furiRes.ok) {
                    const furiData = await furiRes.json();
                    assistantMessage.furigana = furiData.furigana;
                }
            } catch (e) {
                console.error('Furigana failed:', e);
            }
        }
        
        state.messages.push(assistantMessage);
        saveMessages();
        
    } catch (error) {
        alert(error.message);
    } finally {
        state.isLoading = false;
        sendBtn.disabled = false;
        hideTypingIndicator();
        renderMessages();
    }
}

// 엔터 키 처리
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// 대화 삭제
function clearChat() {
    if (confirm('모든 대화 내용을 삭제하시겠습니까?')) {
        state.messages = [];
        addWelcomeMessage();
    }
}

// 설정 모달
function toggleSettings() {
    settingsModal.classList.toggle('show');
}

function closeSettingsOnOverlay(event) {
    if (event.target === settingsModal) {
        toggleSettings();
    }
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('apiKey');
    const icon = document.getElementById('eyeIcon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
        input.type = 'password';
        icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
}

function selectDifficulty(btn) {
    document.querySelectorAll('.segment').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function selectTopic(btn) {
    document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

