import Request from "supertest";
import application from "@/server"
import { clearAllDatabase } from "../fixtures/clearDatabase";
import database from "@/configuration/database";
import { Token } from "@/types/token.type";
import UserService from "@/service/user.service";
import ClientService from "@/service/client.service";
import HelperService from "@/service/helper.service";
import { Occupation } from "@/types/occupation.type";

const ONE_MINUTE = 60 * 1000;

jest.setTimeout(ONE_MINUTE);
jest.useFakeTimers()

let client = {
    name: "client",
    email: "client@gmail.com",
    password: "User12345@",
    birthdate: new Date("2000-01-01"),
    sex: "OTHER",
    role: "USER",
    image: "../assets/image/default-avatar.png",
    height: 1.89,
    weight: 100,
    isEmailVerified: false,
};


let helper = {
    name: "helper",
    email: "helper@gmail.com",
    password: "User12345@",
    birthdate: new Date("2000-01-01"),
    sex: "OTHER",
    role: "USER",
    image: "../assets/image/default-avatar.png",
    isEmailVerified: false,
};

beforeAll(async () => {
    if (!database.isInitialized)
        await database.initialize()
            .then(async () => {
                console.log("🌎 Database initialized");
                try {
                    await ClientService.createClient(client.name, client.email, client.password, client.birthdate, client.sex, client.role, client.height, client.weight, [], client.image);
                    await HelperService.createHelper(helper.name, helper.email, helper.password, helper.birthdate, helper.sex, helper.role, [], Occupation.OTHER, [], client.image);
                    console.log("👶 Users created");
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
    describe("Test all resources of Auth.Controller using (CLIENT)", () => {
        describe("Test POST /auth/login", () => {
            test("Should return a 400 status code if a valid email and password is sent", async () => {
                await Request(application)
                    .post("/auth/login")
                    .set({ authorization: `Basic Y2xpZW50QGdtYWlsLmNvbTpVc2VyMTIz` })
                    .expect(400)
                    .then(response => {
                        expect(response.body).toHaveProperty("message");
                        expect(response.body.message).toBe("Invalid credentials.")
                    });
            });

            test("Should return a 201 status code if a valid email and password is sent", async () => {
                await Request(application)
                    .post("/auth/login")
                    .set({ authorization: `Basic Y2xpZW50QGdtYWlsLmNvbTpVc2VyMTIzNDVA` })
                    .expect(201)
                    .then(response => {
                        expect(response.body).toHaveProperty("tokens");
                        expect(response.body.tokens).toHaveProperty("accessToken");
                        expect(response.body.tokens).toHaveProperty("refreshToken");

                        expect(response.body).toHaveProperty("user");
                        expect(response.body.user).toMatchObject({
                            name: client.name,
                            email: client.email,
                            birthdate: client.birthdate.toISOString(),
                            sex: client.sex,
                            role: client.role,
                            image: client.image,
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
                        expect(response.body.message).toBe("The token supplied is invalid.")
                    });
            });

            test("Should return a 200 status code if a valid token is sent", async () => {
                const user = await UserService.getUserByEmail(client.email);
                let token = user.tokens.find(token => token.type === Token.REFRESH_TOKEN)?.jwt;

                await Request(application)
                    .post("/auth/logout")
                    .set({ authorization: `Bearer ${token}` })
                    .expect(200)
                    .then(response => {
                        expect(response.body).toHaveProperty("message");
                        expect(response.body.message).toBe("You have been successfully lifted.")
                    });
            });
        });
    });

    describe("Test all resources of Auth.Controller using (HELPER)", () => {
        describe("Test POST /auth/login", () => {
            test("Should return a 400 status code if a valid email and password is sent", async () => {
                await Request(application)
                    .post("/auth/login")
                    .set({ authorization: `Basic aGVscGVyQGdtYWlsLmNvbTpVc2VyMTIz` })
                    .expect(400)
                    .then(response => {
                        expect(response.body).toHaveProperty("message");
                        expect(response.body.message).toBe("Invalid credentials.")
                    });
            });

            test("Should return a 201 status code if a valid email and password is sent", async () => {
                await Request(application)
                    .post("/auth/login")
                    .set({ authorization: `Basic aGVscGVyQGdtYWlsLmNvbTpVc2VyMTIzNDVA` })
                    .expect(201)
                    .then(response => {
                        expect(response.body).toHaveProperty("tokens");
                        expect(response.body.tokens).toHaveProperty("accessToken");
                        expect(response.body.tokens).toHaveProperty("refreshToken");

                        expect(response.body).toHaveProperty("user");
                        expect(response.body.user).toMatchObject({
                            name: helper.name,
                            email: helper.email,
                            birthdate: helper.birthdate.toISOString(),
                            sex: helper.sex,
                            role: helper.role,
                            image: helper.image,
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
                        expect(response.body.message).toBe("The token supplied is invalid.")
                    });
            });

            test("Should return a 200 status code if a valid token is sent", async () => {
                const user = await UserService.getUserByEmail(helper.email);
                let token = user.tokens.find(token => token.type === Token.REFRESH_TOKEN)?.jwt;

                await Request(application)
                    .post("/auth/logout")
                    .set({ authorization: `Bearer ${token}` })
                    .expect(200)
                    .then(response => {
                        expect(response.body).toHaveProperty("message");
                        expect(response.body.message).toBe("You have been successfully lifted.")
                    });
            });
        });
    });
});
