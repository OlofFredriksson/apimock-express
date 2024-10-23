import { expect } from "chai";
import pkg from "../../test-server.js";

const { hostname } = pkg;

describe("Advanced mockformat", function () {
    describe("Headers", function () {
        it("POST /headers/sign should respond with 302 redirect", async () => {
            const res = await fetch(`http://${hostname}/headers/redirect`, {
                method: "post",
                redirect: "manual",
            });
            expect(res.status).to.equal(302);
            expect(res.headers.get("location")).to.equal("http://google.com");
        });
    });
});
