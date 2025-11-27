🇯🇵 NihongoChat

An AI chat web app designed for Koreans learning Japanese. Practice Japanese naturally as if you’re chatting with a Japanese friend using GPT.

✨ Key Features
🗣️ Chat with an AI Japanese Friend

Natural Japanese conversation powered by GPT-4o-mini

Experience chatting like you’re talking to a real Japanese friend

Grammar mistakes are corrected naturally

📚 Personalized Learning

Difficulty Levels: Beginner, Intermediate, Advanced

Topic-based Conversations: Daily life, travel, food, culture, business, anime, etc.

Customizable Chat Partner Name

📖 Learning Assistant

Korean Translation: Click AI messages to see the Korean translation

Furigana: Shows reading for kanji

Toggle options available

🛠️ Tech Stack

Backend: FastAPI (Python)

Frontend: HTML, CSS, JavaScript

AI Model: OpenAI GPT-4o-mini

Storage: Browser LocalStorage

📱 Getting Started
Requirements

Python 3.9 or higher

OpenAI API key

Installation

Install dependencies:

cd /Users/naheepark/Desktop/Japanese
pip install -r requirements.txt


Run the server:

python main.py


Or run directly with uvicorn:

uvicorn main:app --reload --host 0.0.0.0 --port 8000


Open in a browser:

http://localhost:8000


Enter your OpenAI API key in the ⚙️ Settings at the top right

How to Get an OpenAI API Key

Go to OpenAI Platform

Sign up or log in

Create a new key in the API Keys menu

Enter the key in the app settings

📂 Project Structure
Japanese/
├── main.py              # FastAPI server
├── requirements.txt     # Python dependencies
├── README.md            # Project description
├── templates/
│   └── index.html       # Main HTML template
└── static/
    ├── style.css        # Stylesheet
    └── app.js           # Frontend JavaScript

🎨 Screenshots

When running the app, you can see:

Chat interface: Talk with your AI Japanese friend

Settings modal: Set API key, difficulty, topic, etc.

🔧 Settings Options
Setting	Description
API Key	OpenAI API key
Chat Partner Name	AI friend’s name (default: Yuki)
Difficulty	Beginner / Intermediate / Advanced
Conversation Topic	Free chat, daily life, travel, etc.
Show Translation	Toggle Korean translation of AI messages
Show Furigana	Toggle kanji readings
🔌 API Endpoints
Endpoint	Method	Description
/	GET	Main chat page
/api/chat	POST	Chat with GPT
/api/translate	POST	Japanese → Korean translation
/api/furigana	POST	Generate furigana
📝 License

This project was created for personal learning and portfolio purposes.

🤝 Contributing

Report bugs or suggest features by opening an issue!

Learn Japanese and enjoy chatting as if you have a friend! 🌸

원하시면 제가 이걸 더 깔끔하게 포트폴리오용 README 느낌으로 다듬어서 바로 GitHub에 올릴 수 있게 만들어줄 수도 있어요.
혹시 그렇게 해드릴까요?

나의 말:
웅
ChatGPT의 말:

좋아요! 그럼 제가 지금 번역된 내용을 포트폴리오용 README 느낌으로 깔끔하게 다듬어서 GitHub에 바로 올릴 수 있도록 만들어드릴게요.

🇯🇵 NihongoChat

NihongoChat is an AI chat web app for Korean learners of Japanese. Practice Japanese naturally as if you’re chatting with a real Japanese friend!

✨ Features
🗣️ Chat with an AI Japanese Friend

Natural Japanese conversation powered by GPT-4o-mini

Experience realistic chatting with a Japanese friend

Grammar mistakes are corrected naturally

📚 Personalized Learning

Difficulty Levels: Beginner, Intermediate, Advanced

Topics: Daily life, travel, food, culture, business, anime, etc.

Customizable AI friend name

📖 Learning Tools

Korean Translation: Click AI messages to see Korean translations

Furigana: Displays kanji readings

Toggle options available

🛠️ Tech Stack

Backend: FastAPI (Python)

Frontend: HTML, CSS, JavaScript

AI Model: OpenAI GPT-4o-mini

Storage: Browser LocalStorage

📱 Getting Started
Requirements

Python 3.9+

OpenAI API key

Installation
# Install dependencies
cd /path/to/Japanese
pip install -r requirements.txt

# Run the server
python main.py

# Or using uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000


Open your browser:

http://localhost:8000


Enter your OpenAI API key in the ⚙️ Settings menu.

Get an OpenAI API Key

Go to OpenAI Platform

Sign up or log in

Create a new key in API Keys

Enter the key in the app settings

📂 Project Structure
Japanese/
├── main.py              # FastAPI server
├── requirements.txt     # Python dependencies
├── README.md            # Project description
├── templates/
│   └── index.html       # Main HTML template
└── static/
    ├── style.css        # Stylesheet
    └── app.js           # Frontend JavaScript

🎨 Screenshots

Chat Interface: Chat naturally with your AI Japanese friend

Settings Modal: Configure API key, difficulty, topic, etc.

🔧 Settings Options
Setting	Description
API Key	OpenAI API key
AI Friend Name	Name of the AI chat partner (default: Yuki)
Difficulty	Beginner / Intermediate / Advanced
Conversation Topic	Free chat, daily life, travel, etc.
Show Translation	Toggle Korean translations of AI messages
Show Furigana	Toggle kanji readings
🔌 API Endpoints
Endpoint	Method	Description
/	GET	Main chat page
/api/chat	POST	Chat with GPT
/api/translate	POST	Japanese → Korean translation
/api/furigana	POST	Generate furigana
📝 License

This project is for personal learning and portfolio purposes.

🤝 Contributing

Bug reports or feature suggestions are welcome via issues.

Practice Japanese in a fun and interactive way, like chatting with a friend! 🌸
