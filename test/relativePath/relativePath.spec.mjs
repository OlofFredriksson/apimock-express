import { expect } from "chai";
import { hostname } from "../../test-server.mjs";

describe("Relative path mocks", function () {
    it("GET - should find json file", async () => {
        const res = await fetch(
            `http://${hostname}/relative-path/relative-json`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    it("GET - should find js file", async () => {
        const res = await fetch(
            `http://${hostname}/relative-path/relative-js`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });
});
