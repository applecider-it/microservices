import { WebSocket, WebSocketServer } from 'ws';

import { log } from '@/services/system/log.js';
import { appConfig } from '@/config/config.js';

import RedisCtrl from './server/RedisCtrl.js';
import WebSocketCtrl from './server/WebSocketCtrl.js';
import SendCtrl from './server/SendCtrl.js';

import { WebSocketUser, Incoming } from './types.js';

/**
 * WebSocket サーバー管理
 */
export default class Server {
  /** WebSocket サーバーのRedis管理 */
  private redisCtrl;
  /** WebSocket サーバーのWebSocket管理 */
  private webSocketCtrl;
  /** WebSocket サーバーの送信管理 */
  private sendCtrl;

  constructor() {
    const host = appConfig.webSocket.host;
    const port = appConfig.webSocket.port;
    const redisUrl = appConfig.redis.url;

    this.sendCtrl = new SendCtrl();

    // WebSocket管理初期化
    this.webSocketCtrl = new WebSocketCtrl(
      host,
      port,
      async (ws: WebSocket) => {
        await this.onConnect(ws);
      },
      async (ws: WebSocket) => {
        await this.onDisconnect(ws);
      },
    );

    // Redis管理初期化
    this.redisCtrl = new RedisCtrl(
      async (sender: WebSocketUser, incoming: Incoming, type: string) => {
        await this.onRedisMessage(sender, incoming, type);
      },
      redisUrl,
    );

    // 割り当て
    this.sendCtrl.assign(this.redisCtrl, this.webSocketCtrl);
  }

  /** Redisメッセージ受信時の処理 */
  private async onRedisMessage(
    sender: WebSocketUser,
    incoming: Incoming,
    type: string,
  ) {
    await this.sendCtrl.broadcast(sender, incoming, type);
  }

  /** 接続時の処理 */
  private async onConnect(ws: WebSocket) {
    const user = ws.user as WebSocketUser;

    log('onDisconnect', user);

    this.sendCtrl.sendConnected(ws);
    this.sendCtrl.sendConnectOther(ws);
  }

  /** 切断時の処理 */
  private async onDisconnect(ws: WebSocket) {
    const user = ws.user as WebSocketUser;

    log('onDisconnect', user);

    this.sendCtrl.sendDisconnectOther(ws);
  }
}
