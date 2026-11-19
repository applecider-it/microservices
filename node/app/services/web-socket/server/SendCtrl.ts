import { log } from '@/services/system/log.js';

import type { WebSocket, WebSocketServer } from 'ws';

import { WebSocketUser, Incoming, BroadcastSendData } from '../types.js';

import type RedisCtrl from './RedisCtrl.js';
import type WebSocketCtrl from './WebSocketCtrl.js';
import UsersCtrl from './send-ctrl/UsersCtrl.js';
import BroadcastCtrl from './send-ctrl/BroadcastCtrl.js';

/**
 * WebSocket サーバーの送信管理
 */
export default class SendCtrl {
  /** WebSocket サーバーのRedis管理 */
  private redisCtrl!: RedisCtrl;
  /** WebSocket サーバーのWebSocket管理 */
  private webSocketCtrl!: WebSocketCtrl;
  /** WebSocket サーバーの全てのユーザー管理 */
  private usersCtrl!: UsersCtrl;

  /** WebSocket サーバーのBroadcast管理 */
  private broadcastCtrl: BroadcastCtrl;

  constructor() {
    this.broadcastCtrl = new BroadcastCtrl();
    this.usersCtrl = new UsersCtrl();
  }

  /** 割り当て */
  public async assign(
    redisCtrl: RedisCtrl,
    webSocketCtrl: WebSocketCtrl,
  ) {
    this.redisCtrl = redisCtrl;
    this.webSocketCtrl = webSocketCtrl;

    this.broadcastCtrl.assign(this.webSocketCtrl);
  }

  /** ブロードキャスト */
  public async broadcast(
    sender: WebSocketUser,
    incoming: Incoming,
    type: string,
  ) {
    this.usersCtrl.updateGlobalUser(sender, incoming, type);

    await this.broadcastCtrl.broadcast(sender, incoming, type);
  }

  /** 接続したユーザーのみに、ユーザー一覧を送信 */
  public async sendConnected(ws: WebSocket) {
    const wss = this.webSocketCtrl.getWss();

    ws.send(
      JSON.stringify({
        type: 'connected',
        users: this.usersCtrl.getSameChannelUsers(wss, ws),
      }),
    );
  }

  /** 同じチャンネル全体に、接続したユーザーの情報を送信 */
  public async sendConnectOther(ws: WebSocket) {
    const user = ws.user as WebSocketUser;

    const channel = user.channel;

    const type = 'connectOther';
    const data = {
      user: this.broadcastCtrl.toBroadcastUser(user),
    };
    await this.redisCtrl.publish(channel, data, type);
  }

  /** 同じチャンネル全体に、切断したユーザーの情報を送信 */
  public async sendDisconnectOther(ws: WebSocket) {
    const user = ws.user as WebSocketUser;

    const channel = user.channel;

    const type = 'disconnectOther';
    const data = {
      user: this.broadcastCtrl.toBroadcastUser(user),
    };
    await this.redisCtrl.publish(channel, data, type);
  }
}
