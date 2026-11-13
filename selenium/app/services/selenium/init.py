from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# ドライバー初期化
def init_driver():
  options = Options()

  # root/WSL環境でChromeがクラッシュするのを防ぐ（ほぼ必須）
  options.add_argument("--no-sandbox")

  # /dev/shm（共有メモリ）不足によるクラッシュ対策（WSLやDockerで重要）
  options.add_argument("--disable-dev-shm-usage")

  # DevTools通信用ポートを指定（WSL環境での起動安定化）
  options.add_argument("--remote-debugging-port=9222")

  # Chromeのユーザーデータ（プロファイル）保存先を指定
  # セッション・Cookie・ログイン状態などがここに保存される
  options.add_argument("--user-data-dir=./tmp/chrome-test")

  driver = webdriver.Chrome(options=options)

  # Window状態設定
  driver.set_window_position(100, 100)  # x, y
  driver.set_window_size(1200, 1200)    # 幅, 高さ

  print("browserName: " + driver.capabilities["browserName"])

  return driver
