import { expect } from "chai";
import pkg from "../../test-server.js";

const { hostname } = pkg;

describe("Examplefile", function () {
    it("Nothing matches", async () => {
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

    it("One request parameter matches", async () => {
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

    it("Two request parameters matches", async () => {
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

    it("One body parameter matches", async () => {
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

    it("Two body parameters matches", async () => {
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

    it("Both request parameter and body matches", async () => {
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

    it("One body parameter matches. Default status", async () => {
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
