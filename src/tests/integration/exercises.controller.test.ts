
import Request from "supertest";
import application from "@/server"
describe("Test /GET ", () => {
    test("Should 200 and return all target muscles", async () => {
        await Request(application)
            .get("/drop/targetMuscleList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.targetMusclesValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all equipments", async () => {

        await Request(application)
            .get("/drop/equipmentsList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.equipmentsValues.length).toBeGreaterThan(0)
            })
    })


    test("Should 200 and return all body parts", async () => {
        await Request(application)
            .get("/drop/bodyPartsList")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                expect(response.body.bodyPartsValues.length).toBeGreaterThan(0)
            })
    })
});