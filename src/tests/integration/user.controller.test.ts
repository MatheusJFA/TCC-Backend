import Request from "supertest";
import application from "@/server"
import { correctUser, userWithInvalidParameters, userWithMissingParameters } from "../fixtures/users";
import { clearAllDatabase } from "../fixtures/clearDatabase";
import database from "@/configuration/database";
import UserService from "@/service/user.service";

const ONE_MINUTE = 60 * 1000;

jest.setTimeout(ONE_MINUTE);
jest.useFakeTimers()

beforeAll(async () => {
    if (!database.isInitialized)
        await database.initialize()
            .then(() => {
                console.log("🌎 Database initialized");
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

describe("Test all resources of User.controller", () => {
    describe("Test POST /users", () => {
        test("should return a 400 status code if user is missing some parameters", async () => {
            await Request(application)
                .post("/user")
                .set({ authorization: `Basic cGFzc3dvcmQxMjNQQA` })
                .send({
                    user: {
                        ...userWithMissingParameters
                    }
                })
                .then(response => {
                    expect(response.status).toBe(400);
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Birthdate is invalid.");
                });
        });

        test("should return a 400 status code if user email is invalid", async () => {
            await Request(application)
                .post("/user")
                .set({ authorization: `Basic cGFzc3dvcmQxMjNQQA` })
                .send({
                    user: {
                        ...userWithInvalidParameters,
                    }
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("E-mail is invalid.");
                })
        });

        test("should return a 400 status code if the password is weak", async () => {
            await Request(application)
                .post("/user")
                .set({ authorization: `Bearer cGFzc3dvcmQ` })
                .send({
                    user: {
                        ...correctUser
                    }
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Password is invalid.");
                })
        });

        test("should return a 201 status code and a user", async () => {
            await Request(application)
                .post("/user")
                .set({ authorization: `Bearer cGFzc3dvcmQxMjNQQA` })
                .send({
                    user: {
                        ...correctUser
                    }
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body.user).toMatchObject({
                        id: expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/),
                        birthdate: "2000-01-01T00:00:00.000Z",
                        email: "user-correct@gmail.com",
                        role: "USER",
                        image: "../assets/image/default-avatar.png",
                        name: "testonildo",
                        sex: "OTHER",
                    });

                })
        });
    });


    describe("Test /GET users", () => {
        test("Should return a 404 status code if a user was not found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .get(`/user/${id}`)
                .expect(404)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("User was not found.");
                });
        });

        test("Should return a 200 status code if a user was found", async () => {
            const allUsers = await UserService.getUsers();
            const { users, total } = allUsers;

            let user = users[0];

            await Request(application)
                .get(`/user/${user.id}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(total).toBeGreaterThan(0);
                    expect(response.body).toHaveProperty("user");
                    expect(response.body.user).toMatchObject({
                        id: user.id,
                        birthdate: user.birthdate.toISOString(),
                        email: user.email,
                        image: user.image,
                        name: user.name,
                        role: user.role,
                        sex: user.sex,
                    });
                });
        });
    });

    describe("Test /PUT user", () => {
        test("Should return a 404 status error if no user was found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .put(`/user/${id}`)
                .send({
                    user: {
                        name: "testonildo",
                        email: "user-correct@gmail.com",
                        birthdate: "2001-01-01",
                        sex: "OTHER",
                    }
                })
                .expect("Content-Type", /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("User was not found.");
                });
        });

        test("Should return a 200 status code if user updated", async () => {
            const user = await UserService.getUserByEmail("user-correct@gmail.com");

            await Request(application)
                .put(`/user/${user.id}`)
                .send({
                    user: {
                        name: "teste",
                        email: "user-correct@gmail.com",
                        birthdate: "2001-01-01",
                        sex: "OTHER",
                    }
                })
                .expect("Content-Type", /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).toHaveProperty("user");
                    expect(response.body.user).toMatchObject({
                        id: expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/),
                        birthdate: "2001-01-01T00:00:00.000Z",
                        email: user.email,
                        image: user.image,
                        name: "teste",
                        role: user.role,
                    });
                });
        });
    });

    describe("Test /DELETE user", () => {
        test("Should return a 404 status code if no user with that id was found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .delete(`/user/${id}`)
                .expect("Content-Type", /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("User was not found.");
                });

        })

        test("Should return a 200 status code if the user was deleted", async () => {
            const user = await UserService.getUserByEmail("user-correct@gmail.com");

            await Request(application)
                .delete(`/user/${user.id}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("The user was Deleted successfully.");
                });

        })
    })
});