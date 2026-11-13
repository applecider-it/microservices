/** WebSocketオブジェクトに追加するユーザー情報 */
export interface WebSocketUser {
  name: string;
  id: number;
  token: string;
  channel: string;
}

/** ブロードキャスト用のユーザー情報 */
export interface WebSocketUserSimple {
  channel: string;
}

/** 送信されてくるデータ */
export type Incoming = {
  data: any;
};

/** ブロードキャスト用送信データ */
export type BroadcastSendData = {
  type: string;
  data: any;
};
