
import Request from "supertest";
import application from "@/server"
describe("Test /GET ", () => {
    test("Should 200 and return all cuisine values", async () => {
        await Request(application)
            .get("/drop/cuisineList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.CuisineValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all intolerances values", async () => {

        await Request(application)
            .get("/drop/intolerancesList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.IntolerancesValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all diet values", async () => {
        await Request(application)
            .get("/drop/dietsList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.DietValues.length).toBeGreaterThan(0)
            })
    })

    test("Should 200 and return all carb intake values", async () => {
        await Request(application)
            .get("/drop/carbsIntakeList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.CarbsIntakeValues.length).toBeGreaterThan(0)
            })
    })
});