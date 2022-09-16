import Request from "supertest";
import application from "@/server"
import { correctClient, clientWithInvalidParameters , clientWithMissingParameters } from "../fixtures/clients";
import { clearAllDatabase } from "../fixtures/clearDatabase";
import database from "@/configuration/database";
import ClientService from "@/service/client.service";

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

describe("Test all resources of Client.controller", () => {
    describe("Test POST /clients", () => {
        test("should return a 400 status code if client is missing some parameters", async () => {
            await Request(application)
                .post("/client")
                .set({ authorization: `Basic cGFzc3dvcmQxMjNQQA` })
                .send({
                    client: {
                        ...clientWithMissingParameters
                    }
                })
                .then(response => {
                    expect(response.status).toBe(400);
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Data de nascimento é inválido(a).");
                });
        });

        test("should return a 400 status code if client email is invalid", async () => {
            await Request(application)
                .post("/client")
                .set({ authorization: `Basic cGFzc3dvcmQxMjNQQA` })
                .send({
                    client: {
                        ...clientWithInvalidParameters,
                    }
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("E-mail é inválido(a).");
                })
        });

        test("should return a 400 status code if the password is weak", async () => {
            await Request(application)
                .post("/client")
                .set({ authorization: `Bearer cGFzc3dvcmQ` })
                .send({
                    client: {
                        ...correctClient
                    }
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Senha é inválido(a).");
                })
        });

        test("should return a 201 status code and a client", async () => {
            await Request(application)
                .post("/client")
                .set({ authorization: `Bearer cGFzc3dvcmQxMjNQQA` })
                .send({
                    client: {
                        ...correctClient
                    }
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body.client).toMatchObject({
                        id: expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/),
                        birthdate: "2000-01-01T00:00:00.000Z",
                        email: "client-correct@gmail.com",
                        image: "../assets/image/default-avatar.png",
                        name: "testonildo",
                        role: "USER",
                        height: 1.89,
                        weight: 100,
                        sex: "OTHER",
                    });
                })
        });
    });


    describe("Test /GET clients", () => {
        test("Should return a 404 status code if a client was not found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .get(`/client/${id}`)
                .expect(404)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Usuário não foi encontrado.");
                });
        });

        test("Should return a 200 status code if a client was found", async () => {
            const allClients = await ClientService.getClients();
            const { clients, total } = allClients;

            let client = clients[0];

            await Request(application)
                .get(`/client/${client.id}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(total).toBeGreaterThan(0);
                    expect(response.body).toHaveProperty("client");
                    expect(response.body.client).toMatchObject({
                        id: client.id,
                        birthdate: client.birthdate.toISOString(),
                        email: client.email,
                        image: client.image,
                        name: client.name,
                        role: client.role,
                        sex: client.sex,
                        height: client.height,
                        weight: client.weight,
                    });
                });
        });
    });

    describe("Test /PUT client", () => {
        test("Should return a 404 status error if no client was found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .put(`/client/${id}`)
                .send({
                    client: {
                        name: "testonildo",
                        email: "client-correct@gmail.com",
                        birthdate: "2001-01-01",
                        sex: "OTHER",
                        height: 1.80,
                        weight: 100,
                    }
                })
                .expect("Content-Type", /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Usuário não foi encontrado.");
                });
        });

        test("Should return a 200 status code if client updated", async () => {
            const client = await ClientService.getClientByEmail("client-correct@gmail.com");

            await Request(application)
                .put(`/client/${client.id}`)
                .send({
                    client: {
                        name: "testonildo",
                        email: "client-correct@gmail.com",
                        birthdate: "2001-01-01",
                        sex: "OTHER",
                        height: 1.80,
                        weight: 100,
                    }
                })
                .expect("Content-Type", /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).toHaveProperty("client");
                    expect(response.body.client).toMatchObject({
                        id: client.id,
                        birthdate: "2001-01-01T00:00:00.000Z",
                        email: client.email,
                        image: client.image,
                        name: "testonildo",
                        role: client.role,
                    });
                });
        });
    });

    describe("Test /DELETE client", () => {
        test("Should return a 404 status code if no client with that id was found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .delete(`/client/${id}`)
                .expect("Content-Type", /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Usuário não foi encontrado.");
                });

        })

        test("Should return a 200 status code if the client was deleted", async () => {
            const client = await ClientService.getClientByEmail("client-correct@gmail.com");

            await Request(application)
                .delete(`/client/${client.id}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("O Usuário foi deletado com sucesso.");
                });

        })
    })
});