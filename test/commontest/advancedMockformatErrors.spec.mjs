import { expect } from "chai";
import { hostname } from "../../test-server.mjs";

describe("Advanced mockformat", function () {
    describe("Errors", function () {
        it("Should return an empty string for an empty file", async () => {
            const res = await fetch(
                `http://${hostname}/api/advanced/emptyfile`,
                { method: "get" },
            );
            const body = await res.text();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.equal("");
        });

        it("Should return the default response if only default response", async () => {
            const res = await fetch(
                `http://${hostname}/api/advanced/only_defaultresponse`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return an empty string if no body in only default response", async () => {
            const res = await fetch(
                `http://${hostname}/api/advanced/only_defaultresponse_no_body`,
                { method: "get" },
            );
            const body = await res.text();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.equal("");
        });

        it("Should return the default status if no status in only default response", async () => {
            const res = await fetch(
                `http://${hostname}/api/advanced/only_defaultresponse_no_status`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return an error if the file is malformed", async () => {
            const res = await fetch(
                `http://${hostname}/api/advanced/malformedfile`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                error: "Malformed mockfile. See server log",
            });
        });

        it("Should return an error if the input body is malformed", async () => {
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: "{",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ error: "Malformed input body" });
        });

        it("Should not parse the body, but return the default response if input body is not json", async () => {
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: "foo=bar",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
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
});
