import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("Relative path mocks", function () {
    test("GET - should find json file", async () => {
        const res = await fetch(
            `http://${hostname}/relative-path/relative-json`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    test("GET - should find js file", async () => {
        const res = await fetch(
            `http://${hostname}/relative-path/relative-js`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });
});
