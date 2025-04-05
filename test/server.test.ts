import request from "supertest";
import {app} from "../src/server";
import { initiateProcessing } from "../src";
import { TransformedUserData } from "../src/types";
import {Server} from "http";

jest.mock("../src/index", () => ({
    initiateProcessing: jest.fn()
}));

describe("API Test", () => {

    let server: Server;

    beforeAll(() => {
        server = app.listen(0);
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll((done) => {
        server.close(done)
    });

    it("should return transformed user data", async () => {
        const mockData: TransformedUserData = {
            Engineering: {
                male: 1,
                female: 1,
                ageRange: "25-30",
                hair: { Black: 1, Blonde: 1 },
                addressUser: { JohnDoe: "12345", JaneSmith: "54321" }
            }
        };

        (initiateProcessing as jest.Mock).mockResolvedValue(mockData);

        const response = await request(server).get("/api/users");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(initiateProcessing).toHaveBeenCalledTimes(1);
    });

    it("should handle errors", async () => {
        (initiateProcessing as jest.Mock).mockRejectedValue(new Error("Test error"));

        const response = await request(server).get("/api/users");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: "Test error"
        });
    });
});
