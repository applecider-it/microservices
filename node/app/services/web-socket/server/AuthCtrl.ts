import jwt from 'jsonwebtoken';
import { type IncomingMessage } from 'http';

import { log } from '@/services/system/log.js';

import { WebSocketUser } from '../types.js';

import { appConfig } from '@/config/config.js';

/**
 * WebSocket サーバーのAuth管理
 */
export default class AuthCtrl {
  /**
   * JWTから認証してユーザー情報を返す
   */
  public authenticate(req: IncomingMessage): WebSocketUser | null {
    const url = req.url as string;

    const params = new URLSearchParams(url.replace('/?', ''));
    const token = params.get('token');

    log(`token: ${token}`);

    if (!token) return null;

    let payload: any = null;

    try {
      payload = jwt.verify(token, appConfig.jwtSecret);
    } catch (e) {
      console.error(e);
      return null;
    }

    return {
      id: payload.id,
      name: payload.name,
      token,
      channel: payload.channel,
    };
  }
}
