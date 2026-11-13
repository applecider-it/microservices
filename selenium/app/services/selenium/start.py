import time
import argparse

from .init import init_driver
from .patterns.sample import start_sample
from .patterns.sample2 import start_sample2

# セレニウムプロセス開始
def start_selenium():
  parser = argparse.ArgumentParser()
  parser.add_argument("pattern_name", nargs="?", default="none")

  args = parser.parse_args()

  print("pattern_name: " + args.pattern_name)

  driver = init_driver()

  driver.get("http://localhost:3000/")

  time.sleep(0.5)

  _start_pattern(driver, args.pattern_name)

  input("Enter押すまで終了しない...")

# パターン開始
def _start_pattern(driver, pattern_name):
  if pattern_name == "sample":
    start_sample(driver)
  elif pattern_name == "sample2":
    start_sample2(driver)
