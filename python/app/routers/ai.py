from fastapi import APIRouter, File, UploadFile
import numpy as np
import cv2

from app.services.ai.image_analysis import exec_image_analysis

router = APIRouter()

# 画像解析
@router.post("/image_analysis")
async def image_analysis(file: UploadFile = File(...)):
    # 画像読み込み（バイト → numpy）
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result = exec_image_analysis(img)

    return {"result": result}
