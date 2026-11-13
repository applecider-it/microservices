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
  },

  /** WebSocketのRedis連携 */
  webSocketRedis: {
    /** WebSocketサーバーのRedis Pub/Subで利用するチャンネル */
    channel: process.env.APP_WS_REDIS_CHANNEL as string,
  },
} as const;
