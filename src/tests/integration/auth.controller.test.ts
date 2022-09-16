import Request from "supertest";
import application from "@/server"
import { clearAllDatabase } from "../fixtures/clearDatabase";
import database from "@/configuration/database";
import ClientService from "@/service/client.service";
import { IClient } from "@/entity/client.entity";
import { Token } from "@/types/token.type";

const ONE_MINUTE = 60 * 1000;

jest.setTimeout(ONE_MINUTE);
jest.useFakeTimers()

let USER = {
    name: "user",
    email: "user@gmail.com",
    password: "Client12345@",
    birthdate: new Date("2000-01-01"),
    height: 1.89,
    weight: 100,
    sex: "OTHER",
    role: "USER",
    image: "../assets/image/default-avatar.png",
    isEmailVerified: false,
} as IClient;

let ADMINISTRATOR = {
    name: "admin",
    email: "admin@gmail.com",
    password: "Admin12345@",
    birthdate: new Date("2000-01-01"),
    height: 1.89,
    weight: 100,
    sex: "OTHER",
    role: "USER",
    image: "../assets/image/default-avatar.png",
    isEmailVerified: false
} as IClient;

beforeAll(async () => {
    if (!database.isInitialized)
        await database.initialize()
            .then(async () => {
                console.log("🌎 Database initialized");
                try {
                    await ClientService.createClient(USER);
                    await ClientService.createClient(ADMINISTRATOR);
                    console.log("👶 Clients created");
                } catch (error) {
                    console.log("❌ Couldn't create users", error);
                }
            })
            .catch((error) => {
                console.log(`❌ Database initialization failed: ${error}`);
            })


});

afterAll(async () => {
    await clearAllDatabase()
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));
});

describe("Test all resources of Auth.Controller", () => {
    describe("Test POST /auth/login", () => {
        test("Should return a 400 status code if a valid email and password is sent", async () => {
            await Request(application)
                .post("/auth/login")
                .set({ authorization: `Basic dXNlckBnbWFpbC5jb206VXNlcjEyMw==` })
                .expect(400)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Credenciais inválidas.")
                });
        });

        test("Should return a 201 status code if a valid email and password is sent", async () => {
            await Request(application)
                .post("/auth/login")
                .set({ authorization: `Basic dXNlckBnbWFpbC5jb206VXNlcjEyMzQ1QA==` })
                .expect(201)
                .then(response => {
                    expect(response.body).toHaveProperty("tokens");
                    expect(response.body.tokens).toHaveProperty("accessToken");
                    expect(response.body.tokens).toHaveProperty("refreshToken");

                    expect(response.body).toHaveProperty("user");
                    expect(response.body.user).toMatchObject({
                        id: expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/),
                        name: USER.name,
                        email: USER.email,
                        birthdate: USER.birthdate.toISOString(),
                        sex: USER.sex,
                        height: USER.height.toString(),
                        weight: USER.weight.toString(),
                        role: USER.role,
                        image: USER.image,
                    });
                });
        });
    });

    describe("Test POST /auth/logout", () => {
        test("Should return a 400 status code if an invalid token is sent", async () => {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

            await Request(application)
                .post("/auth/logout")
                .set({ authorization: `Bearer ${token}` })
                .expect(400)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("O token fornecido é inválido.")
                });
        });

        test("Should return a 200 status code if a valid token is sent", async () => {
            const user = await ClientService.getClientByEmail(USER.email);
            let token = user.tokens.find(token => token.type === Token.REFRESH_TOKEN)?.jwt;
            
            await Request(application)
                .post("/auth/logout")
                .set({ authorization: `Bearer ${token}` })
                .expect(200)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Você foi deslogado com sucesso.")
                });
        });
    });
    
});
