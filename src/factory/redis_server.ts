import Redis from "ioredis";
import { promisify } from "util";

const connectionOptions = {
    password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81",
    lazyConnect: true,
    maxRetriesPerRequest: 1
}

const redisClient = new Redis(connectionOptions);
redisClient.on('error', (err) => {
    // Tratar erro silenciosamente em ambiente local sem Redis rodando
});

function getRedis(value) {
    const syncRedisGet = promisify(redisClient.get).bind(redisClient);
    return syncRedisGet(value);
}

function setRedis(key, value) {
    const syncRedisSet = promisify(redisClient.set).bind(redisClient);
    return syncRedisSet(key, value);
}

export { redisClient, getRedis, setRedis };