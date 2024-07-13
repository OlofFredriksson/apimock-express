import fs from "node:fs";
import { expect } from "chai";
import fetch from "node-fetch";
import { hostname } from "../../test-server.mjs";

describe("Url matching", function () {
    it("A correct url that starts with mock url should match", async () => {
        const expectedBody = fs.readFileSync("test/api/simple/users.json", {
            encoding: "utf-8",
        });
        const res = await fetch(`http://${hostname}/api/simple/users/`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    it("Must start with the mock url", async () => {
        //The url matches but not in the beginning
        const expectedBody = "Cannot GET /foo/api/simple/users/";
        const res = await fetch(`http://${hostname}/foo/api/simple/users/`, {
            method: "get",
        });
        const body = await res.text();
        expect(res.status).to.equal(404);
        expect(body).to.have.string(expectedBody);
    });

    it("A incorrect url should not match", async () => {
        const expectedBody = "Cannot GET /foo/simple/users/";
        const res = await fetch(`http://${hostname}/foo/simple/users/`, {
            method: "get",
        });
        const body = await res.text();
        expect(res.status).to.equal(404);
        expect(body).to.have.string(expectedBody);
    });
});
