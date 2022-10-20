import { redisClient } from "@/server";

const DEFAULT_EXPIRATION_TIME = 24 * 60 * 60; // 1 day
const SEVEN_DAYS = 7 * 24 * 60 * 60; // 7 days
const TEN_DAYS = 10 * 24 * 60 * 60; // 10 days

export function getOrSetCache(key: string, callback: Function) {
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


export function getOrSetWeeklyCache(key: string, callback: Function) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, async (error, response) => {
            if (error) reject(error);
            else if (response) return resolve(JSON.parse(response));
            else {
                const data = await callback();
                redisClient.setex(key, SEVEN_DAYS, JSON.stringify(data));
                resolve(data)
            }
        })
    });
}

export function getOrSetLongCache(key: string, callback: Function) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, async (error, response) => {
            if (error) reject(error);
            else if (response) return resolve(JSON.parse(response));
            else {
                const data = await callback();
                redisClient.setex(key, TEN_DAYS, JSON.stringify(data));
                resolve(data)
            }
        })
    });
}

export default {
    getOrSetCache,
    getOrSetWeeklyCache,
    getOrSetLongCache
}