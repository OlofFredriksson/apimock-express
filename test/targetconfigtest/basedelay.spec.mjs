import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("Basedelay", function () {
    const DELAY_TIME = 1000;

    describe("simple mockformat", function () {
        test("GET /api2/hello should not be delayed", async () => {
            const starttime = new Date().getTime();
            const expectedBody = { id: "api" };
            const res = await fetch(`http://${hostname}/api2/hello`, {
                method: "get",
            });
            const endtime = new Date().getTime();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.most(DELAY_TIME);
        });

        test("GET /apiX/hello should be delayed", async () => {
            const starttime = new Date().getTime();
            const expectedBody = { id: "apiX" };
            const res = await fetch(`http://${hostname}/apiX/hello`, {
                method: "get",
            });
            const endtime = new Date().getTime();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.least(DELAY_TIME);
        });
    });

    describe("advanced mockformat", function () {
        test("GET /api2/helloAdv should not be delayed", async () => {
            const starttime = new Date().getTime();
            const expectedBody = { id: "api" };
            const res = await fetch(`http://${hostname}/api2/helloAdv`, {
                method: "get",
            });
            const endtime = new Date().getTime();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.most(DELAY_TIME);
        });

        test("GET /apiX/helloAdv should be delayed", async () => {
            const starttime = new Date().getTime();
            const expectedBody = { id: "apiX" };
            const res = await fetch(`http://${hostname}/apiX/helloAdv`, {
                method: "get",
            });
            const endtime = new Date().getTime();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.least(DELAY_TIME);
        });
    });
});
