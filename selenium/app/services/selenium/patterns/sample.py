import time
from selenium.webdriver.common.by import By

# サンプル開始
def start_sample(driver):
  _setup(driver)
  _exec(driver)

# セットアップ
def _setup(driver):
  link = driver.find_element(By.LINK_TEXT, "development")
  link.click()

  time.sleep(0.2)

  link = driver.find_element(By.LINK_TEXT, "view_test")
  link.click()

  time.sleep(0.2)

# 実行
def _exec(driver):
  result_all = True

  radio_id = "view_test_form_radio_val_val2"

  radio = driver.find_element(By.ID, radio_id)
  result = not radio.is_selected()
  result_all = result_all and result

  print(f"Radio (Before): {result}")

  radio.click()

  time.sleep(0.5)

  btn = driver.find_element(By.CSS_SELECTOR, 'input[value="送信"]')
  btn.click()

  time.sleep(0.5)

  radio = driver.find_element(By.ID, radio_id)
  result = radio.is_selected()
  result_all = result_all and result

  print(f"Radio (After): {result}")

  print(f"All: {result_all}")
