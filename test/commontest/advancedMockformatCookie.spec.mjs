import { expect } from "chai";
import { hostname } from "../../test-server.mjs";

describe("Advanced mockformat", function () {
    describe("Cookies", function () {
        it("Should return the response for the first cookie match", async () => {
            const headers = {
                Cookie: "foo=foo",
            };
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers: headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(400);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foo" });
        });

        it("Should return the response for the second cookie match", async () => {
            const headers = {
                Cookie: "foo=bar",
            };
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers: headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "bar" });
        });

        it("Should return the default response if no match", async () => {
            const headers = {
                Cookie: "asdf=asdf",
            };
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers: headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return the default response if no cookies in mockfile", async () => {
            const headers = {
                Cookie: "foo=foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/cookie_no_cookies`,
                {
                    method: "get",
                    headers: headers,
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("Should return the default response if no cookies in request", async () => {
            const headers = {};
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers: headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });
    });
});
