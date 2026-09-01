import Redis from "ioredis";

const connectionOptions: any = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    lazyConnect: true,
    maxRetriesPerRequest: 1
};

if (process.env.REDIS_PASSWORD) {
    connectionOptions.password = process.env.REDIS_PASSWORD;
}

const redisClient = new Redis(connectionOptions);
redisClient.on('error', (err) => {
    // Tratar erro silenciosamente em ambiente local sem Redis rodando
});

async function getRedis(key: string): Promise<string | null> {
    return await redisClient.get(key);
}

async function setRedis(key: string, value: any): Promise<string | null> {
    if (value === null || value === undefined) {
        await redisClient.del(key);
        return null;
    }
    return await redisClient.set(key, typeof value === 'string' ? value : JSON.stringify(value));
}

export { redisClient, getRedis, setRedis, connectionOptions };