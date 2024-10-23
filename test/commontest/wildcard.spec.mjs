import { expect } from "chai";
import pkg from "../../test-server.js";

const { hostname } = pkg;

describe("Wildcard", function () {
    it("should pick wildcard file for GET if specific not found", async () => {
        const res = await fetch(`http://${hostname}/api/wildcard/123`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({ message: "Wildcard GET" });
    });

    it("should pick wildcard file for POST if specific not found", async () => {
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/wildcard/123`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({ message: "Wildcard POST" });
    });
});
