import "reflect-metadata";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import helmet from "helmet";
import path from "path";

import cors from "cors";
import i18next, { t } from "i18next";
import i18next_backend from "i18next-fs-backend";
import i18next_middleware from "i18next-http-middleware";

import Redis from "ioredis";

import { Server } from "socket.io";
import { createAdapter } from "socket.io-redis";

import SessionStore from "./store/session";
import MessageStore from "./store/messages";

import crypto from "crypto";

import http from "http";

import hpp from "hpp";
import compression from "compression";

import passport from "passport";
import jwtStrategy from "./configuration/passport";
import morganMiddleware from "@/configuration/morgan";

import router from "./routes/index.routes";
import { changeLocale } from "@middleware/changeLocale";
import enviroment from "./configuration/enviroment";
import Database from "./configuration/database";
import { Enviroment } from "./types/enviroment.type";

(async () => {
    if (!Database.isInitialized)
        await Database.initialize()
            .then(() => console.log("🌎 Connected to database"))
            .catch((error) => {
                console.log("❌ Could not connect to the database")
                console.log(`error: ${error}`)
            })
})(); // Conecta ao banco de dados 


const application = express();
application.use(express.json()); // Aceita requisições do tipo JSON.
application.use(express.urlencoded({ extended: true }));

application.use(changeLocale); // Troca o locale da aplicação caso seja necessário
application.use(morganMiddleware); // Gera logs da aplicação

const WORKERS_COUNT = 5;

(async () => {
    await i18next
        .use(i18next_backend)
        .use(i18next_middleware.LanguageDetector)
        .init({
            fallbackLng: "pt",
            preload: ["pt"],
            backend: {
                loadPath: path.join(__dirname, "locale/{{lng}}.json")
            }
        }).then(() => {
            console.log("🔤 I18n initialized");
        }).catch(error => console.log(`❌ Could not connect with i18n. Error: ${error}`));
})(); // Configurações do i18next

application.use(i18next_middleware.handle(i18next)); // Permitir a internacionalização do projeto
application.use(router); // Rotas da aplicação

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true
}; // Opções do cors do que é permitido acessar o backend

application.use(cors(corsOptions)); // Bloquear outras URLs de acessar o site 
application.use(hpp()); // Proteger contra o ataque de HTTP Parameter Polution   
application.use(helmet()); // Proteção contra ataques enviados nos headers
application.use(compression()); // Comprime o tamanho do response

application.use(passport.initialize());
passport.use("jwt", jwtStrategy);

application.use("/files", express.static(path.join(__dirname, "..", "uploads"))); // usa a pasta files como um arquivo estático permitindo ser acessada através da URL.

export const redisClient = new Redis(enviroment.redis.port, {
    host: enviroment.redis.hostname,
    username: enviroment.redis.username,
    password: enviroment.redis.password
});


if (enviroment.node_enviroment !== Enviroment.TEST) {
    const httpServer = http.createServer(application);

    (async () => {
        console.log((await redisClient.ping()).toString() === "PONG" ? "🌎 Redis Server is Connected" : "❌ Redis Server is Not connected")
    })();

    try {
        const messageServer = new Server(httpServer, {
            cors: {
                origin: enviroment.url.frontend
            },

            adapter: createAdapter({
                pubClient: redisClient,
                subClient: redisClient.duplicate()
            })
        });

        const sessionStore = new SessionStore(redisClient);
        const messageStore = new MessageStore(redisClient)

        messageServer.use(async (socket: any, next) => {
            const sessionId = socket.handshake.auth.sessionId;

            if (sessionId) {
                const session = await sessionStore.findSession(sessionId);

                if (session) {
                    socket.id = session.userId;
                    socket.sessionId = sessionId;
                    socket.email = session.email;
                    return next();
                }

                const email = socket.handshake.auth.email;

                if (!email) return next(new Error(t("ERROR.PARAMETERS.INVALID_GENERIC")));

                socket.sessionId = crypto.randomBytes(8).toString("hex");
                socket.userId = crypto.randomBytes(8).toString("hex");
                next();
            }
        });

        messageServer.on("connect", async (socket: any) => {
            if (enviroment.node_enviroment !== Enviroment.PRODUCTION) {
                socket.onAny((event: string, ...args: any) => { console.log({ event, args }) });
            }

            // Save session
            sessionStore.saveSession(socket.sessionId, {
                userId: socket.userId,
                email: socket.email,
                connected: "true"
            });

            //emit session details
            socket.emit("session", {
                sessionId: socket.sessionId,
                userId: socket.userId
            });

            // Join the "userId" room
            socket.join(socket.userId);

            //Fetch all existing users
            const users: any = [];

            const [messages, sessions] = await Promise.all([
                messageStore.findMessagesForUser(socket.userId),
                sessionStore.findAllSessions()
            ]);

            const messagesPerUser = new Map();
            messages.forEach((message) => {
                const { from, to } = message;
                const otherUser = socket.userId === from ? to : from;
                if (messagesPerUser.has(otherUser))
                    messagesPerUser.get(otherUser).push(message);
                else
                    messagesPerUser.set(otherUser, [message]);
            });

            sessions.forEach((session) => {
                users.push({
                    userId: session.userId,
                    email: session.email,
                    connected: session.connected,
                    messages: messagesPerUser.get(session.userId) || [],
                });
            });

            socket.emit("users", users);

            socket.broadcast.emit("userConnected", {
                userId: socket.userId,
                email: socket.email,
                connected: true,
                messages: [],
            })

            socket.on("joinGroup", async ({ room, socketId }, callback: Function) => {
                const allSockets = await messageServer.in(room).fetchSockets();


                if (allSockets.includes(socket.id)) socket.id = socketId;
                else socket.join(room)

                const messages = messageStore.findMessagesForGroup(room);
                callback(messages);
            });


            socket.on("groupMessage", ({ text, room }) => {
                const message = {
                    text,
                    from: socket.userId,
                    to: room,
                    createdAt: new Date()
                };

                socket.to(room).to(socket.userId).emit("groupMessage", message);
                messageStore.saveGroupMessage(message);
            });

            socket.on("privateMessage", ({ text, to }) => {
                const message = {
                    text,
                    from: socket.userId,
                    to,
                    createdAt: new Date()
                };

                socket.to(to).to(socket.userId).emit("privateMessage", message);
                messageStore.savePrivateMessage(message);
            });

            socket.on("userDisconnected", async () => {
                const matchingSockets = await messageServer.in(socket.userId).allSockets();

                const isDisconnected = matchingSockets.size === 0;

                if (isDisconnected) {
                    socket.broadcast.emit("userDisconnected", socket.userId);

                    sessionStore.saveSession(socket.sessionId, {
                        userId: socket.userId,
                        email: socket.email,
                        connected: "false"
                    })
                }
            });
        });

    } catch (error) {
        console.log(`❌ MessageServer ${error}`)
    }

}

export default application;