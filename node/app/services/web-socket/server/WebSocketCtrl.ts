import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

import { log } from '@/services/system/log.js';

import AuthCtrl from './AuthCtrl.js';

/**
 * WebSocket サーバーのWebSocket管理
 */
export default class WebSocketCtrl {
  /** WebSockerサーバーインスタンス */
  private wss: WebSocketServer;
  /** 接続時のコールバック */
  private callbackConnected: Function;
  /** 切断時のコールバック */
  private callbackDisconnected: Function;
  /** WebSocket サーバーのAuth管理 */
  private authCtrl;

  constructor(
    host: string,
    port: number,
    callbackConnected: Function,
    callbackDisconnected: Function,
    authCtrl: AuthCtrl,
  ) {
    this.callbackConnected = callbackConnected;
    this.callbackDisconnected = callbackDisconnected;
    this.authCtrl = authCtrl;

    this.wss = new WebSocketServer({ host, port });

    this.wss.on('connection', (ws, req) => this.handleConnection(ws, req));

    log(`WebSocket server running on ws://${host}:${port}`);
  }

  /** コネクション時 */
  private handleConnection(ws: WebSocket, req: IncomingMessage) {
    const user = this.authCtrl.authenticate(req);

    if (!user) {
      log('invalid authenticate');
      ws.close();
      return;
    }

    ws.user = user;
    log(`Authenticated:`, user.name);

    // WebSocketへの直接送信は無効
    ws.on('message', (msg) => {
      log(`handleConnection: message:`, String(msg));
      log('handleConnection: suspended');
    });

    ws.on('close', () => {
      log(`Disconnected: ${ws.user?.name}`);
      this.callbackDisconnected(this.wss, ws);
    });

    this.callbackConnected(this.wss, ws);
  }

  // getter

  public getWss() {
    return this.wss;
  }
}
