import { expect } from "chai";
import pkg from "../../test-server.js";

const { hostname } = pkg;

describe("Advanced mockformat", function () {
    describe("Bodyparameter", function () {
        it("Should return the response for the first bodyparamter match", async () => {
            const requestbody = { foo: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(402);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foo" });
        });

        it("Should return the response for the second bodyparamter match", async () => {
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "bar" });
        });

        it("Should return the default response if no match in bodyparameter value", async () => {
            const requestbody = { foo: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return the default response if no match in bodyparameter name", async () => {
            const requestbody = { bar: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return an error if no match and no default response", async () => {
            const requestbody = { foo: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_no_defaultresponse`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                error: "No response could be found",
            });
        });

        it("Should return the default response if no bodyparameters in mockfile", async () => {
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_no_parameters`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });
    });

    describe("Complex Bodyparameter", function () {
        it("Should match two parameters on second level", async () => {
            const requestbody = {
                user: {
                    firstname: "Luke",
                    lastname: "Skywalker",
                    address: { street: "Milkyway", zipcode: "12345" },
                },
                foo: "foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 2. Firstname and lastname matches",
            });
        });

        it("Should match one parameter on second level", async () => {
            const requestbody = {
                user: {
                    firstname: "Luke",
                    lastname: "Macahan",
                    address: { street: "Milkyway", zipcode: "12345" },
                },
                foo: "foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(501);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 2. Firstname matches",
            });
        });

        it("Should match one parameter on third level", async () => {
            const requestbody = {
                user: {
                    firstname: "Zeb",
                    lastname: "Macahan",
                    address: { street: "The wild west", zipcode: "55555" },
                },
                foo: "foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(502);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 3. zipcode matches",
            });
        });

        it("Should match one parameter on first level", async () => {
            const requestbody = {
                user: {
                    firstname: "Zeb",
                    lastname: "Macahan",
                    address: { street: "The wild west", zipcode: "12345" },
                },
                foo: "bar",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(503);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 1. foo matches",
            });
        });

        it("Should handle a request that do not contain all of the mock parameters", async () => {
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(503);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 1. foo matches",
            });
        });

        it("Should return the default answer if no match", async () => {
            const requestbody = { asdf: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "No match, default response",
            });
        });
    });

    describe("Bodyparameters", function () {
        it("Should return the default answer if only one of two bodyparameters matches", async () => {
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameters`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return the answer for both bodyparameters match", async () => {
            const requestbody = { foo: "bar", bar: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameters`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(403);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foobar" });
        });
    });

    describe("Bodyparameter and requestparameter", function () {
        it("Should return the default answer if only the requestparameter matches", async () => {
            const requestbody = { asdf: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?foo=bar`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return the default answer if only the bodyparameter matches", async () => {
            const requestbody = { bar: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?asdf=asdf`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return the answer for requestparameter and bodyparameter match", async () => {
            const requestbody = { bar: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?foo=bar`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(404);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foobar" });
        });
    });
});
