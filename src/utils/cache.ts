import { redisClient } from "@/server";

const DEFAULT_EXPIRATION_TIME = 24 * 60 * 60; // 1 day

export default function getOrSetCache(key: string, callback: Function) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, async (error, response) => {
            if (error) reject(error);
            if (response) return resolve(JSON.parse(response));
            const data = await callback();
            redisClient.setex(key, DEFAULT_EXPIRATION_TIME, JSON.stringify(data));
            resolve(data)
        })
    });
}