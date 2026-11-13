import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { log } from '@/services/system/log.js';

/** .env読み込み */
export function loadEnv(): void {
  log('import.meta.url', import.meta.url);
  const path = fileURLToPath(import.meta.url);
  const dir = dirname(dirname(dirname(dirname(path))));
  log('dir', dir);
  dotenv.config({ path: `${dir}/.env` });
}
