import 'ws';

import { WebSocketUser } from './types';

declare module 'ws' {
  // WebSocketに独自のuser値を追加した
  interface WebSocket {
    user?: WebSocketUser;
  }
}
