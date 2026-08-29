import Redis from "ioredis";
import { promisify } from "util";

const connectionOptions = {
    password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81"
}

const redisClient = new Redis(connectionOptions);

function getRedis(value) {
    const syncRedisGet = promisify(redisClient.get).bind(redisClient);
    return syncRedisGet(value);

    // redisClient.get("")
}

function setRedis(key, value) {
    const syncRedisSet = promisify(redisClient.set).bind(redisClient);
    return syncRedisSet(key, value);

    // redisClient.set("", "")
}

export { redisClient, getRedis, setRedis };