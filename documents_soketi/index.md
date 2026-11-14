# Soketi

Laravel Echoで利用しています。

動作確認用に、Redis Pub/Subの複数サーバー対応をしています。

## リクエストの遷移

```
Laravel
   |
   | HTTP (Pusher互換)
   v
soketi (master)
   |
   | Redis adapter (pub/sub)
   v
soketi (worker or same process)
   |
WebSocket
   v
Browser
```