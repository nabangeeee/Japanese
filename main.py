from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="니혼고챗", description="일본어 학습 채팅 앱")

# 정적 파일 및 템플릿 설정
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 난이도별 프롬프트
DIFFICULTY_PROMPTS = {
    "beginner": """당신은 일본어를 배우는 한국인의 일본인 친구입니다. 쉬운 일본어로 대화해주세요.
- 히라가나와 카타카나를 주로 사용해주세요
- 쉬운 단어와 짧은 문장을 사용해주세요
- 존댓말(です・ます형)을 사용해주세요
- 상대방의 일본어 실수를 부드럽게 고쳐주세요
- 가끔 한국어로 설명을 덧붙여도 좋습니다""",
    
    "intermediate": """당신은 일본어를 배우는 한국인의 일본인 친구입니다. 자연스러운 일본어로 대화해주세요.
- 한자도 적당히 사용해주세요 (읽는 법 포함)
- 일상회화 수준의 표현을 사용해주세요
- 존댓말과 반말을 상황에 맞게 사용해주세요
- 문법 실수가 있으면 자연스럽게 올바른 표현을 알려주세요""",
    
    "advanced": """당신은 일본어를 배우는 한국인의 일본인 친구입니다. 자연스럽고 고급스러운 일본어로 대화해주세요.
- 네이티브 수준의 표현을 사용해주세요
- 관용구나 슬랭도 적절히 사용해주세요
- 비즈니스 일본어나 경어 표현도 포함해주세요
- 더 자연스러운 표현이 있으면 제안해주세요"""
}

# 주제별 프롬프트
TOPIC_PROMPTS = {
    "free": "자유롭게 대화해주세요.",
    "dailyLife": "일상생활에 대해 이야기해주세요. (아침에 일어나서 잠들기까지의 일들)",
    "travel": "일본 여행에 대해 이야기해주세요. (관광지, 교통, 숙박 등)",
    "food": "일본 음식이나 요리에 대해 이야기해주세요.",
    "culture": "일본 문화에 대해 이야기해주세요. (축제, 습관, 전통 등)",
    "business": "비즈니스 일본어로 대화해주세요. (회의, 전화 응대, 이메일 등)",
    "anime": "애니메이션이나 만화에 대해 이야기해주세요."
}


class ChatRequest(BaseModel):
    message: str
    history: list = []
    api_key: str
    partner_name: str = "유키"
    difficulty: str = "beginner"
    topic: str = "free"


class TranslateRequest(BaseModel):
    text: str
    api_key: str


def get_system_prompt(partner_name: str, difficulty: str, topic: str) -> str:
    difficulty_prompt = DIFFICULTY_PROMPTS.get(difficulty, DIFFICULTY_PROMPTS["beginner"])
    topic_prompt = TOPIC_PROMPTS.get(topic, TOPIC_PROMPTS["free"])
    
    return f"""당신의 이름은 "{partner_name}"입니다. 일본에 사는 20대 일본인입니다.
{difficulty_prompt}

대화 주제: {topic_prompt}

중요한 규칙:
- 한국인 일본어 학습자와 친구처럼 자연스럽게 대화해주세요
- 너무 긴 답변은 피하고, 2-3문장 정도로 답해주세요
- 가끔 질문을 던져서 대화를 이어가주세요
- 상대방의 일본어가 틀리면 자연스럽게 올바른 표현으로 답해주세요
- 이모지를 적당히 사용해서 친근한 분위기를 만들어주세요
- 반드시 일본어로 대화해주세요"""


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/chat")
async def chat(req: ChatRequest):
    if not req.api_key:
        raise HTTPException(status_code=400, detail="API 키가 필요합니다.")
    
    try:
        client = OpenAI(api_key=req.api_key)
        
        messages = [{"role": "system", "content": get_system_prompt(req.partner_name, req.difficulty, req.topic)}]
        messages.extend(req.history[-10:])  # 최근 10개 대화만
        messages.append({"role": "user", "content": req.message})
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.8,
            max_tokens=1000
        )
        
        return {"response": response.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/translate")
async def translate(req: TranslateRequest):
    if not req.api_key:
        raise HTTPException(status_code=400, detail="API 키가 필요합니다.")
    
    try:
        client = OpenAI(api_key=req.api_key)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 번역가입니다. 주어진 일본어를 한국어로 번역해주세요. 번역만 출력해주세요."},
                {"role": "user", "content": req.text}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        return {"translation": response.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/furigana")
async def furigana(req: TranslateRequest):
    if not req.api_key:
        raise HTTPException(status_code=400, detail="API 키가 필요합니다.")
    
    try:
        client = OpenAI(api_key=req.api_key)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": """주어진 일본어 문장에 후리가나를 붙여주세요.
한자 옆에 히라가나로 읽는 법을 표시해주세요.
형식: 한자(후리가나)
예: 今日(きょう)は天気(てんき)がいいですね。"""},
                {"role": "user", "content": req.text}
            ],
            temperature=0.1,
            max_tokens=500
        )
        
        return {"furigana": response.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

