import { WebSocket, WebSocketServer } from 'ws';

import { log } from '@/services/system/log.js';
import { appConfig } from '@/config/config.js';

import RedisCtrl from './server/RedisCtrl.js';
import WebSocketCtrl from './server/WebSocketCtrl.js';
import UsersCtrl from './server/UsersCtrl.js';
import AuthCtrl from './server/AuthCtrl.js';
import BroadcastCtrl from './server/BroadcastCtrl.js';

import { WebSocketUser, Incoming } from './types.js';

/**
 * WebSocket サーバー管理
 */
export default class Server {
  /** WebSocket サーバーのRedis管理 */
  private redisCtrl;
  /** WebSocket サーバーのWebSocket管理 */
  private webSocketCtrl;
  /** WebSocket サーバーの全てのユーザー管理 */
  private usersCtrl;
  /** WebSocket サーバーのBroadcast管理 */
  private broadcastCtrl;

  constructor() {
    const host = appConfig.webSocket.host;
    const port = appConfig.webSocket.port;
    const redisUrl = appConfig.redis.url;

    const authCtrl = new AuthCtrl();

    this.broadcastCtrl = new BroadcastCtrl();
    this.usersCtrl = new UsersCtrl();

    // WebSocket管理初期化
    this.webSocketCtrl = new WebSocketCtrl(
      host,
      port,
      async (wss: WebSocketServer, ws: WebSocket) => {
        await this.onConnect(wss, ws);
      },
      async (wss: WebSocketServer, ws: WebSocket) => {
        await this.onDisconnect(wss, ws);
      },
      authCtrl,
    );

    // Redis管理初期化
    this.redisCtrl = new RedisCtrl(
      async (sender: WebSocketUser, incoming: Incoming, type: string) => {
        await this.onRedisMessage(sender, incoming, type);
      },
      redisUrl,
    );
  }

  /** Redisメッセージ受信時の処理 */
  private async onRedisMessage(
    sender: WebSocketUser,
    incoming: Incoming,
    type: string,
  ) {
    this.usersCtrl.updateGlobalUser(sender, incoming, type);

    await this.broadcastCtrl.broadcast(
      sender,
      incoming,
      type,
      this.webSocketCtrl.getWss(),
    );
  }

  /** 接続時の処理 */
  private async onConnect(wss: WebSocketServer, ws: WebSocket) {
    const user = ws.user as WebSocketUser;

    const channel = user.channel;

    // 接続したユーザーのみに、ユーザー一覧を送信
    ws.send(
      JSON.stringify({
        type: 'connected',
        users: this.usersCtrl.getSameChannelUsers(wss, ws),
      }),
    );

    // 同じチャンネル全体に、接続したユーザーの情報を送信
    const type = 'connectOther';
    const data = {
      user: this.broadcastCtrl.toBroadcastUser(user),
    };
    await this.redisCtrl.publish(channel, data, type);
  }

  /** 切断時の処理 */
  private async onDisconnect(wss: WebSocketServer, ws: WebSocket) {
    const user = ws.user as WebSocketUser;

    const channel = user.channel;

    // 同じチャンネル全体に、切断したユーザーの情報を送信
    const type = 'disconnectOther';
    const data = {
      user: this.broadcastCtrl.toBroadcastUser(user),
    };
    await this.redisCtrl.publish(channel, data, type);
  }
}
