import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("js mocks", function () {
    test("plain file", async () => {
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

    test("default export", async () => {
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

    test("remove relativ path for error message, file not found", () => {
        expect("../../app/private/../v1".replace(/^(?:\.\.\/)+/, "")).to.equal(
            "app/private/../v1",
        );
    });

    test("commonjs file (.cjs)", async () => {
        const res = await fetch(`http://${hostname}/api/js/commonjs`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(body).to.deep.equal({
            foo: "cjs",
        });
    });
});
