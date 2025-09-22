import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("Advanced mockformat", function () {
    describe("Headers", function () {
        test("Should return the second response if one matches", async () => {
            const headers = {
                header1: "one",
                header2: "2",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestheaders`,
                { method: "get", headers },
            );
            const body = await res.json();
            expect(res.status).to.equal(402);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "one" });
        });

        test("Should return the first response if both matches", async () => {
            const headers = {
                header1: "one",
                header2: "two",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestheaders`,
                { method: "get", headers },
            );
            const body = await res.json();
            expect(res.status).to.equal(401);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "onetwo" });
        });

        test("Should return the first response if two of three matches", async () => {
            const headers = {
                header1: "one",
                header2: "two",
                header3: "three",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestheaders`,
                { method: "get", headers },
            );
            const body = await res.json();
            expect(res.status).to.equal(401);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "onetwo" });
        });

        test("Should return the default response if no matches", async () => {
            const headers = {
                header1: "foo",
                header2: "bar",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestheaders`,
                { method: "get", headers },
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
