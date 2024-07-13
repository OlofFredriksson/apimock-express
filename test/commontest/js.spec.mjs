import { expect } from "chai";
import fetch from "node-fetch";
import { hostname } from "../../test-server.mjs";

describe("js mocks", function () {
    it("plain file", async () => {
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/js/file`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            foo: "bar",
        });
    });

    it("default export", async () => {
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/js/default-export`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            foo: "bar",
        });
    });

    it("remove relativ path for error message, file not found", () => {
        expect("../../app/private/../v1".replace(/^(?:\.\.\/)+/, "")).to.equal(
            "app/private/../v1",
        );
    });
});
