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

describe("Test all resources of Helper.controller", () => {
    test("", () => {
        
    })
});