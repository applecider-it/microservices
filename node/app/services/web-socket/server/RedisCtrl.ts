import Redis from 'ioredis';

import { log } from '@/services/system/log.js';

import { WebSocketUserSimple, Incoming } from '../types.js';

import { appConfig } from '@/config/config.js';

/**
 * WebSocket サーバーのRedis管理
 */
export default class RedisCtrl {
  /** subscribeで利用するRedisクラス */
  private redisSub;
  /** publishで利用するRedisクラス（pub/subはインスタンスを分けないと動作しなくなる） */
  private redisPub;

  /** pub/subで利用するチャンネル */
  private pubsubChannel;

  /** メッセージ受信時のコールバック */
  private callback: Function;

  constructor(callback: Function, redisUrl: string) {
    this.callback = callback;
    this.pubsubChannel =
      appConfig.redis.prefix + appConfig.webSocketRedis.channel;

    this.redisSub = new Redis(redisUrl);
    this.redisPub = new Redis(redisUrl);

    // Redisの連携用チャンネルをsubscribeする
    this.redisSub.subscribe(this.pubsubChannel, async (err, count) => {
      if (err) console.error(err);
      else console.log(`Subscribed to ${count} channel(s)`);
    });

    this.redisSub.on('message', async (channel, message) => {
      await this.handleRedisMessage(channel, message);
    });
  }

  /** Redisメッセージ受信時 */
  private async handleRedisMessage(redisChannel: string, message: string) {
    console.log(`Received from Redis: ${redisChannel}: ${message}`);

    let ret = null;
    try {
      ret = JSON.parse(message);
    } catch {
      return;
    }

    const sender: WebSocketUserSimple = {
      channel: ret.channel,
    };

    const incoming: Incoming = {
      data: ret.data,
    };

    const type = ret.type as string;

    log('incoming', incoming);
    log('sender', sender);

    await this.callback(sender, incoming, type);
  }

  /** パブリッシュする */
  async publish(channel: string, data: any, type: string) {
    const sendData = {
      channel,
      data,
      type,
    };
    await this.redisPub.publish(this.pubsubChannel, JSON.stringify(sendData));
  }
}
