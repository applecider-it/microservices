from fastapi import FastAPI
from dotenv import load_dotenv
import os

from app.config import add_middlewares
from app.routers import ai

# .env を読み込む
load_dotenv()

app = FastAPI()

# ミドルウェア追加
add_middlewares(app)

# ルーター追加
app.include_router(ai.router)

if __name__ == "__main__":
     # 直接実行した時

    import uvicorn
    uvicorn.run(app, host=os.getenv("APP_AI_SERVER_HOST"), port=int(os.getenv("APP_AI_SERVER_PORT")))
