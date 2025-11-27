# 🇯🇵 니혼고챗 (NihongoChat)

일본어를 공부하는 한국인을 위한 AI 채팅 웹앱입니다. GPT를 활용하여 일본인 친구와 대화하듯 자연스럽게 일본어를 연습할 수 있습니다.

## ✨ 주요 기능

### 🗣️ AI 일본인 친구와 대화
- GPT-4o-mini 기반의 자연스러운 일본어 대화
- 마치 일본인 친구와 채팅하는 것 같은 경험
- 문법 실수를 자연스럽게 교정해줌

### 📚 맞춤형 학습
- **난이도 설정**: 초급, 중급, 고급 선택 가능
- **주제별 대화**: 일상생활, 여행, 음식, 문화, 비즈니스, 애니메이션 등
- **대화 상대 이름 커스터마이징**

### 📖 학습 도우미
- **한국어 번역**: AI 메시지를 클릭하면 한국어 번역 확인 가능
- **후리가나**: 한자 읽는 법을 함께 표시
- 토글로 켜고 끄기 가능

## 🛠️ 기술 스택

- **백엔드**: FastAPI (Python)
- **프론트엔드**: HTML, CSS, JavaScript
- **AI 모델**: OpenAI GPT-4o-mini
- **저장소**: 브라우저 LocalStorage

## 📱 시작하기

### 요구사항
- Python 3.9 이상
- OpenAI API 키

### 설치 방법

1. 의존성 설치:
```bash
cd /Users/naheepark/Desktop/Japanese
pip install -r requirements.txt
```

2. 서버 실행:
```bash
python main.py
```

또는 uvicorn으로 직접 실행:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. 브라우저에서 열기:
```
http://localhost:8000
```

4. 우측 상단 ⚙️ 설정에서 OpenAI API 키 입력

### OpenAI API 키 발급
1. [OpenAI Platform](https://platform.openai.com/)에 접속
2. 계정 생성 또는 로그인
3. API Keys 메뉴에서 새 키 생성
4. 앱 설정 화면에서 키 입력

## 📂 프로젝트 구조

```
Japanese/
├── main.py              # FastAPI 서버
├── requirements.txt     # Python 의존성
├── README.md           # 프로젝트 설명
├── templates/
│   └── index.html      # 메인 HTML 템플릿
└── static/
    ├── style.css       # 스타일시트
    └── app.js          # 프론트엔드 JavaScript
```

## 🎨 스크린샷

앱 실행 시 다음과 같은 화면을 볼 수 있습니다:
- 채팅 화면: 일본인 친구와 대화하는 인터페이스
- 설정 모달: API 키, 난이도, 주제 등 설정

## 🔧 설정 옵션

| 설정 | 설명 |
|------|------|
| API 키 | OpenAI API 키 |
| 대화 상대 이름 | AI 친구의 이름 (기본값: 유키) |
| 난이도 | 초급/중급/고급 |
| 대화 주제 | 자유 대화, 일상생활, 여행 등 |
| 번역 보기 | AI 메시지 번역 표시 여부 |
| 후리가나 보기 | 한자 읽기 표시 여부 |

## 🔌 API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/` | GET | 메인 채팅 페이지 |
| `/api/chat` | POST | GPT와 대화 |
| `/api/translate` | POST | 일본어 → 한국어 번역 |
| `/api/furigana` | POST | 후리가나 생성 |

## 📝 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요!

---

**일본어 공부, 이제 친구와 대화하듯 재미있게! 🌸**
