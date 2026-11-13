import { log } from '@/services/system/log.js';

import { WebSocket, type WebSocketServer } from 'ws';

import { WebSocketUser, Incoming, BroadcastSendData } from '../types.js';

/**
 * WebSocket サーバーのBroadcast管理
 */
export default class BroadcastCtrl {
  /** 送信処理 */
  public async broadcast(
    sender: WebSocketUser,
    incoming: Incoming,
    type: string,
    wss: WebSocketServer,
  ) {
    log('incoming', incoming);
    log('sender', sender);

    const sendData: BroadcastSendData = {
      type: type,
      data: incoming.data,
    };

    const sendDataStr = JSON.stringify(sendData);

    wss.clients.forEach(async (client: WebSocket) => {
      const user = client.user as WebSocketUser;
      log(`broadcast:`, user.name);

      if (!this.canBroadcast(client, sender.channel)) return;

      log(`canBroadcast:`, user.name);

      client.send(sendDataStr);
    });
  }

  /** 特定のチャンネルに、全体送信できるクライアントか確認 */
  private canBroadcast(client: WebSocket, channel: string) {
    const user = client.user as WebSocketUser;

    if (client.readyState === WebSocket.OPEN) {
      if (user.channel == channel) {
        return true;
      }
    }

    return false;
  }

  /** 送信用ユーザーに変換 */
  public toBroadcastUser(user: WebSocketUser) {
    return {
      name: user.name,
      id: user.id,
    };
  }
}
