import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("Simple mockformat", function () {
    test("GET /api/simple/users/ should return test/api/simple/users.json", async () => {
        const expectedBody = fs.readFileSync("test/api/simple/users.json", {
            encoding: "utf-8",
        });
        const res = await fetch(`http://${hostname}/api/simple/users/`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    test("GET /api/simple/users/1 should return test/api/simple/users/1.json", async () => {
        const expectedBody = fs.readFileSync("test/api/simple/users/1.json", {
            encoding: "utf-8",
        });
        const res = await fetch(`http://${hostname}/api/simple/users/1`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    test("POST /api/simple/users/ should return test/api/simple/users_post.json", async () => {
        const expectedBody = fs.readFileSync(
            "test/api/simple/users_post.json",
            {
                encoding: "utf-8",
            },
        );
        const res = await fetch(`http://${hostname}/api/simple/users/`, {
            method: "post",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    test("PUT /api/simple/users/ should return test/api/simple/users/1_put.json", async () => {
        const expectedBody = fs.readFileSync(
            "test/api/simple/users/1_put.json",
            {
                encoding: "utf-8",
            },
        );
        const res = await fetch(`http://${hostname}/api/simple/users/1`, {
            method: "put",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    test("DELETE /api/simple/users/ should return test/api/simple/users/1_delete.json", async () => {
        const expectedBody = fs.readFileSync(
            "test/api/simple/users/1_delete.json",
            { encoding: "utf-8" },
        );
        const res = await fetch(`http://${hostname}/api/simple/users/1`, {
            method: "delete",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    test("path not found should return an error", async () => {
        const expectedBody = "Error: Cannot find file matching glob";
        const res = await fetch(`http://${hostname}/api/simple/users/1234`, {
            method: "get",
        });
        const body = await res.text();
        expect(res.status).to.equal(500);
        expect(res.headers.get("content-type")).to.equal(
            "text/html; charset=utf-8",
        );
        expect(body).to.have.string(expectedBody);
    });

    test("GET /api/apiX should get find file in apiX-folder", async () => {
        const res = await fetch(`http://${hostname}/api/apiX`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal({ id: "apiX" });
    });
});
