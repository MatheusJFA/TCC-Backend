import Request from "supertest";
import application from "@/server"
import { correctHelper, helperWithInvalidParameters, helperWithMissingParameters } from "../fixtures/helpers";
import { clearAllDatabase } from "../fixtures/clearDatabase";
import database from "@/configuration/database";
import HelperService from "@/service/helper.service";

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

describe("Test all resources of Helper.controller", () => {
    describe("Test POST /helpers", () => {
        test("should return a 400 status code if helper is missing some parameters", async () => {
            await Request(application)
                .post("/helper")
                .set({ authorization: `Basic cGFzc3dvcmQxMjNQQA` })
                .send({
                    helper: {
                        ...helperWithMissingParameters
                    }
                })
                .then(response => {
                    expect(response.status).toBe(400);
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Data de nascimento é inválido(a).");
                });
        });

        test("should return a 400 status code if helper email is invalid", async () => {
            await Request(application)
                .post("/helper")
                .set({ authorization: `Basic cGFzc3dvcmQxMjNQQA` })
                .send({
                    helper: {
                        ...helperWithInvalidParameters,
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
                .post("/helper")
                .set({ authorization: `Bearer cGFzc3dvcmQ` })
                .send({
                    helper: {
                        ...correctHelper
                    }
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Senha é inválido(a).");
                })
        });

        test("should return a 201 status code and a helper", async () => {
            await Request(application)
                .post("/helper")
                .set({ authorization: `Bearer cGFzc3dvcmQxMjNQQA` })
                .send({
                    helper: {
                        ...correctHelper
                    }
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body.helper).toMatchObject({
                        id: expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/),
                        birthdate: "2000-01-01T00:00:00.000Z",
                        email: "helper-correct@gmail.com",
                        image: "../assets/image/default-avatar.png",
                        name: "testonildo",
                        role: "USER",
                        sex: "OTHER",
                    });
                })
        });
    });


    describe("Test /GET helpers", () => {
        test("Should return a 404 status code if a helper was not found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .get(`/helper/${id}`)
                .expect(404)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Usuário não foi encontrado.");
                });
        });

        test("Should return a 200 status code if a helper was found", async () => {
            const allHelpers = await HelperService.getHelpers();
            const { helpers, total } = allHelpers;

            let helper = helpers[0];

            await Request(application)
                .get(`/helper/${helper.id}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .then(response => {
                    expect(total).toBeGreaterThan(0);
                    expect(response.body).toHaveProperty("helper");
                    expect(response.body.helper).toMatchObject({
                        id: helper.id,
                        birthdate: helper.birthdate.toISOString(),
                        email: helper.email,
                        image: helper.image,
                        name: helper.name,
                        role: helper.role,
                        sex: helper.sex,
                    });
                });
        });
    });

    describe("Test /PUT helper", () => {
        test("Should return a 404 status error if no helper was found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .put(`/helper/${id}`)
                .send({
                    helper: {
                        name: "testonildo",
                        email: "helper-correct@gmail.com",
                        birthdate: "2001-01-01",
                        sex: "OTHER",
                    }
                })
                .expect("Content-Type", /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Usuário não foi encontrado.");
                });
        });

        test("Should return a 200 status code if helper updated", async () => {
            const helper = await HelperService.getHelperByEmail("helper-correct@gmail.com");

            await Request(application)
                .put(`/helper/${helper.id}`)
                .send({
                    helper: {
                        name: "teste",
                        email: "helper-correct@gmail.com",
                        birthdate: "2001-01-01",
                        sex: "OTHER",
                    }
                })
                .expect("Content-Type", /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).toHaveProperty("helper");
                    expect(response.body.helper).toMatchObject({
                        birthdate: "2001-01-01T00:00:00.000Z",
                        email: helper.email,
                        image: helper.image,
                        name: "teste",
                        role: helper.role,
                    });
                });
        });
    });

    describe("Test /DELETE helper", () => {
        test("Should return a 404 status code if no helper with that id was found", async () => {
            const id = "0ca2125c-b3a3-43d8-a75c-b0339b3a79cd";

            await Request(application)
                .delete(`/helper/${id}`)
                .expect("Content-Type", /json/)
                .expect(404)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("Usuário não foi encontrado.");
                });

        })

        test("Should return a 200 status code if the helper was deleted", async () => {
            const helper = await HelperService.getHelperByEmail("helper-correct@gmail.com");

            await Request(application)
                .delete(`/helper/${helper.id}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).toHaveProperty("message");
                    expect(response.body.message).toBe("O Usuário foi deletado com sucesso.");
                });

        })
    })
});