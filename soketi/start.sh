export SOKETI_DEBUG=1
#export SOKETI_ADAPTER=redis
export SOKETI_ADAPTER_DRIVER=redis
export SOKETI_REDIS_HOST=127.0.0.1
export SOKETI_REDIS_PORT=6379
export SOKETI_REDIS_DB=0
export SOKETI_DB_REDIS_KEY_PREFIX=laravel-test-database-

export SOKETI_DEFAULT_APP_ID=app-id
export SOKETI_DEFAULT_APP_KEY=app-key
export SOKETI_DEFAULT_APP_SECRET=app-secret

soketi start
