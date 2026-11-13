import os
import cv2
import requests

from app.services.ai.image_analysis import exec_image_analysis

def exec_test():
  print("begin exec_test")

  path = "./tmp/image.jpg"

  if not os.path.exists(path):
      print(f"{path}がありません。")
      return

  # 画像読み込み
  img = cv2.imread(path)

  result = exec_image_analysis(img)

  print("直接実行")
  print(result)

  url = "http://127.0.0.1:8090/image_analysis"
  files = {"file": open(path, "rb")}

  res = requests.post(url, files=files)
  json = res.json()

  print("APIから実行")
  print(json)

exec_test()