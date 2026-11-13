from ultralytics import YOLO

# モデル読み込み（軽量版）
model = YOLO("yolov8n.pt")

# 画像解析実行
def exec_image_analysis(img):
    # 推論（認識）
    results = model(img)

    detections = []

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            name = r.names[cls_id]
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()

            detections.append({
                "label": name,
                "confidence": conf,
                "box": {
                    "x1": xyxy[0],
                    "y1": xyxy[1],
                    "x2": xyxy[2],
                    "y2": xyxy[3],
                }
            })

    return {"results": detections}