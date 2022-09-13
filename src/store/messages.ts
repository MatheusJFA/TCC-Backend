import { Redis } from "ioredis";

interface IMessage {
    text: string;
    to: string;
    from: string;
    createdAt: Date;
}

interface IMessageStore {
    savePrivateMessage(message: IMessage): Promise<void>
    saveGroupMessage(message: IMessage): Promise<void>
    findMessagesForUser(userId: string): Promise<IMessage[]>
    findMessagesForGroup(id: string): Promise<IMessage[]>
}

const CONVERSATION_TTL = 2 * 24 * 60 * 60; // 2 days

export default class MessageStore implements IMessageStore {
    redisClient: Redis;
    constructor(redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async savePrivateMessage(message: IMessage): Promise<void> {
        const value = JSON.stringify(message);

        await this.redisClient
            .multi()
            .rpush(`privateMessages:${message.from}`, value)
            .rpush(`privateMessages:${message.to}`, value)
            .expire(`privateMessages:${message.from}`, CONVERSATION_TTL)
            .expire(`privateMessages:${message.to}`, CONVERSATION_TTL)
            .exec();
    }

    async saveGroupMessage(message: IMessage): Promise<void> {
        const value = JSON.stringify(message);

        await this.redisClient
            .multi()
            .rpush(`groupMessage:${message.from}`, value)
            .rpush(`groupMessage:${message.to}`, value)
            .expire(`groupMessage:${message.from}`, CONVERSATION_TTL)
            .expire(`groupMessage:${message.to}`, CONVERSATION_TTL)
            .exec();
    }

    async findMessagesForUser(userId: string): Promise<IMessage[]> {
        return this.redisClient
            .lrange(`privateMessages:${userId}`, 0, -1)
            .then(results => {
                return results.map(result => JSON.parse(result))
            });
    }

    async findMessagesForGroup(id: string): Promise<IMessage[]> {
        return this.redisClient
        .lrange(`groupMessage:${id}`, 0, -1)
            .then(results => {
                return results.map(result => JSON.parse(result))
            })
    }
}