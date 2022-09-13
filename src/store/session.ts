import { Redis } from "ioredis";

interface ISession {
    userId: string,
    email: string,
    connected: string
}

interface ISessionStore {
    findSession(id: string): Promise<ISession | undefined>
    saveSession(id: string, session: ISession): Promise<void>
    findAllSessions(): Promise<ISession[]>;
}

const SESSION_TTL = 2 * 24 * 60 * 60; // 2 days

export default class SessionStorage implements ISessionStore {
    redisClient: Redis;
    constructor(redisClient: Redis) {
        this.redisClient = redisClient;
    }

    async findSession(id: string): Promise<ISession | undefined> {
        return await this.redisClient
            .hmget(`session:${id}`, "userId", "email", "connected")
            .then(data => {
                if (data) return {
                    userId: data[0],
                    email: data[1],
                    connected: data[2] === "true"
                } as unknown as ISession;
                else return undefined;
            })
    }

    async saveSession(id: string, session: ISession): Promise<void> {
        this.redisClient
            .multi()
            .hset(
                `session:${id}`,
                "userId",
                session.userId,
                `email`,
                session.email,
                "connected",
                session.connected)
            .expire(`session:${id}`, SESSION_TTL)
            .exec();
    }

    async findAllSessions(): Promise<ISession[]> {
        const keys = new Set<string>();
        let nextIndex = 0;

        do {
            const [nextIndexAsString, results] = await this.redisClient.scan(nextIndex, "MATCH", "session:*", "COUNT", 100);

            nextIndex = +nextIndexAsString;
            results.map((value: string) => keys.add(value));
        } while (nextIndex !== 0);

        const commands: any = [];

        keys.forEach((key) => {
            commands.push([
                "hmget",
                key,
                "userId",
                "email",
                "connected"
            ]);
        });

        return this.redisClient
            .multi(commands)
            .exec()
            .then(results => {
                return results.map(([error, sessions]) => error ? undefined : sessions.map((session: ISession) => {
                    return {
                        userId: session[0],
                        email: session[1],
                        connected: session[2] === "true"
                    }
                })).filter(v => !!v);
            });
    }

}