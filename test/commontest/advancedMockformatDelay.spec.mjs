import { expect } from "chai";
import { hostname } from "../../test-server.mjs";

describe("Advanced mockformat", function () {
    const DELAY_TIME = 1000;

    describe("Delay", function () {
        it("GET /api/advanced/delay?foo=bar should not be delayed", async () => {
            const starttime = new Date().getTime();
            const res = await fetch(
                `http://${hostname}/api/advanced/delay?foo=bar`,
            );
            const endtime = new Date().getTime();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal({ message: "default" });
            expect(executionTime).to.be.at.most(DELAY_TIME);
        });

        it("GET /api/advanced/delay?foo=foo should be delayed", async () => {
            const starttime = new Date().getTime();
            const res = await fetch(
                `http://${hostname}/api/advanced/delay?foo=foo`,
            );
            const endtime = new Date().getTime();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal({ message: "delayed" });
            expect(executionTime).to.be.at.least(DELAY_TIME);
        });
    });
});
