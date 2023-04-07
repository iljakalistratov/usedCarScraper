import { getMakeByModel } from "../src/functions/carDatabaseFunctions";

describe("getMakeByModel", () => {
    it("should return the make of the car", () => {
        const result = getMakeByModel("Fiesta");
        expect(result).toBe("Ford");
    });
});