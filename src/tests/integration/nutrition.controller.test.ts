
import Request from "supertest";
import application from "@/server"
describe("Test /GET ", () => {
    test("Should 200 and return all cuisine values", async () => {
        await Request(application)
            .get("/nutrition/cuisineList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.CuisineValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all intolerances values", async () => {

        await Request(application)
            .get("/nutrition/intolerancesList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.IntolerancesValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all diet values", async () => {
        await Request(application)
            .get("/nutrition/dietsList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.DietValues.length).toBeGreaterThan(0)
            })
    })

    test("Should 200 and return all carb intake values", async () => {
        await Request(application)
            .get("/nutrition/carbsIntakeList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.CarbsIntakeValues.length).toBeGreaterThan(0)
            })
    })
});