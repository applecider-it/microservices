import time
from selenium.webdriver.common.by import By

# サンプル2開始
def start_sample2(driver):
  _setup(driver)
  _exec(driver)

# セットアップ
def _setup(driver):
  link = driver.find_element(By.LINK_TEXT, "development")
  link.click()

  time.sleep(0.2)

  link = driver.find_element(By.LINK_TEXT, "javascript_test")
  link.click()

  time.sleep(0.5)

# 実行
def _exec(driver):
  result_all = True

  toast_xpath = '//div[contains(text(),"トーストテスト")]'

  result = False
  try:
    driver.find_element(By.XPATH, toast_xpath)
  except:
    result = True
  result_all = result_all and result

  print(f"Toast (Before): {result}")

  button = driver.find_element(By.XPATH, '//button[contains(text(), "Toast notice")]')
  button.click()

  time.sleep(0.2)

  result = True
  try:
    driver.find_element(By.XPATH, toast_xpath)
  except:
    result = False
  result_all = result_all and result
  
  print(f"Toast (After): {result}")

  print(f"All: {result_all}")
