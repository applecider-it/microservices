import { loadEnv } from '@/services/system/env.js';

loadEnv();

/** アプリケーションの設定 */
export const appConfig = {
  webSocket: {
    host: process.env.APP_WS_HOST as string,
    port: Number(process.env.APP_WS_PORT),
  },

  jwtSecret: process.env.APP_WS_JWT_SECRET as string,

  redis: {
    url: process.env.APP_REDIS_URL as string,

    /** プレフィックス */
    prefix: process.env.APP_REDIS_PREFIX as string,
  },

  /** WebSocketのRedis連携 */
  webSocketRedis: {
    /** WebSocketサーバーのRedis Pub/Subで利用するチャンネル */
    channel: 'broadcast',
  },
} as const;
