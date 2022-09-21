import Request from "supertest";
import application from "@/server"
import { clearAllDatabase } from "../fixtures/clearDatabase";
import database from "@/configuration/database";
import ClientService from "@/service/client.service";
import { IClient } from "@/entity/client.entity";
import { Token } from "@/types/token.type";
import { IHelper } from "@/entity/helper.entity";
import HelperService from "@/service/helper.service";

const ONE_MINUTE = 60 * 1000;

jest.setTimeout(ONE_MINUTE);
jest.useFakeTimers()

let Client = {
    name: "client",
    email: "client@gmail.com",
    password: "Client12345@",
    birthdate: new Date("2000-01-01"),
    height: 1.89,
    weight: 100,
    sex: "OTHER",
    role: "USER",
    image: "../assets/image/default-avatar.png",
    isEmailVerified: false,
} as IClient;

let Helper = {
    name: "helper",
    email: "helper@gmail.com",
    password: "Helper12345@",
    birthdate: new Date("2000-01-01"),
    sex: "OTHER",
    role: "USER",
    occupation: "OTHER",
    image: "../assets/image/default-avatar.png",
    isEmailVerified: false
} as IHelper;

beforeAll(async () => {
    if (!database.isInitialized)
        await database.initialize()
            .then(async () => {
                console.log("🌎 Database initialized");
                try {
                    await ClientService.createClient(Client);
                    await HelperService.createHelper(Helper);
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

describe("Test all resources of Auth.Controller (helper)", () => {
    describe("Test POST /auth/login", () => {
        test("Should return a 400 status code if a valid email and password is sent", async () => {
            await Request(application)
                .post("/auth/login")
                .set({ authorization: `Basic aGVscGVyQGdtYWlsLmNvbTpIZWxwZXIxMjM=` })
                .expect(400)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Credenciais inválidas.")
                });
        });

        test("Should return a 201 status code if a valid email and password is sent", async () => {
            await Request(application)
                .post("/auth/login")
                .set({ authorization: `Basic aGVscGVyQGdtYWlsLmNvbTpIZWxwZXIxMjM0NUA=` })
                .expect(201)
                .then(response => {
                    expect(response.body).toHaveProperty("tokens");
                    expect(response.body.tokens).toHaveProperty("accessToken");
                    expect(response.body.tokens).toHaveProperty("refreshToken");

                    expect(response.body).toHaveProperty("user");
                    expect(response.body.user).toMatchObject({
                        id: expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/),
                        name: Helper.name,
                        email: Helper.email,
                        birthdate: Helper.birthdate.toISOString(),
                        certifications: null,
                        clients: null,
                        occupation: Helper.occupation,
                        sex: Helper.sex,
                        role: Helper.role,
                        image: Helper.image,
                    });
                });
        });
    });


    describe("Test POST /auth/logout (helper)", () => {
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
            const helper = await HelperService.getHelperByEmail(Helper.email);
            let token = helper.tokens.find(token => token.type === Token.REFRESH_TOKEN)?.jwt;

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



describe("Test all resources of Auth.Controller (client)", () => {
    describe("Test POST /auth/login", () => {
        test("Should return a 400 status code if a valid email and password is sent", async () => {
            await Request(application)
                .post("/auth/login")
                .set({ authorization: `Basic Y2xpZW50QGdtYWlsLmNvbTpDbGllbnQxMjM=` })
                .expect(400)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Credenciais inválidas.")
                });
        });

        test("Should return a 201 status code if a valid email and password is sent", async () => {
            await Request(application)
                .post("/auth/login")
                .set({ authorization: `Basic Y2xpZW50QGdtYWlsLmNvbTpDbGllbnQxMjM0NUA=` })
                .expect(201)
                .then(response => {
                    expect(response.body).toHaveProperty("tokens");
                    expect(response.body.tokens).toHaveProperty("accessToken");
                    expect(response.body.tokens).toHaveProperty("refreshToken");

                    expect(response.body).toHaveProperty("user");
                    expect(response.body.user).toMatchObject({
                        id: expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/),
                        name: Client.name,
                        email: Client.email,
                        birthdate: Client.birthdate.toISOString(),
                        sex: Client.sex,
                        height: Client.height.toString(),
                        weight: Client.weight.toString(),
                        role: Client.role,
                        image: Client.image,
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
            const client = await ClientService.getClientByEmail(Client.email);
            let token = client.tokens.find(token => token.type === Token.REFRESH_TOKEN)?.jwt;

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
