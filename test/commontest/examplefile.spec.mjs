import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("Examplefile", function () {
    test("Nothing matches", async () => {
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(201);
        expect(body).to.deep.equal({
            message: "Nothing matches. Default response",
        });
    });

    test("One request parameter matches", async () => {
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/examplefile?foo=bar`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(402);
        expect(body).to.deep.equal({
            message: "One parameter matches",
        });
    });

    test("Two request parameters matches", async () => {
        const requestbody = {};
        const res = await fetch(
            `http://${hostname}/api/examplefile?foo=bar&bar=foo`,
            {
                method: "post",
                body: JSON.stringify(requestbody),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        const body = await res.json();
        expect(res.status).to.equal(401);
        expect(body).to.deep.equal({
            message: "Two parameters matches",
        });
    });

    test("One body parameter matches", async () => {
        const requestbody = { foo: "foo" };
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(404);
        expect(body).to.deep.equal({
            message: "One body parameter matches",
        });
    });

    test("Two body parameters matches", async () => {
        const requestbody = {
            user: { firstname: "Luke", lastname: "Skywalker" },
        };
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(403);
        expect(body).to.deep.equal({
            message: "Two body parameters matches",
        });
    });

    test("Both request parameter and body matches", async () => {
        const requestbody = { bar: "foo" };
        const res = await fetch(`http://${hostname}/api/examplefile?foo=bar`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(400);
        expect(body).to.deep.equal({
            message: "Both parameter and body matches",
        });
    });

    test("One body parameter matches. Default status", async () => {
        const requestbody = { foo: "bar" };
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            message: "One body parameter matches. Default status",
        });
    });
});
