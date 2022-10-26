
import Request from "supertest";
import application from "@/server"
describe("Test /GET ", () => {
    test("Should 200 and return all target muscles", async () => {
        await Request(application)
            .get("/exercise/targetMuscleList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.targetMusclesValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all equipments", async () => {

        await Request(application)
            .get("/exercise/equipmentsList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.equipmentsValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all body parts", async () => {
        await Request(application)
            .get("/exercise/bodyPartsList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.bodyPartsValues.length).toBeGreaterThan(0)
            })
    })
});