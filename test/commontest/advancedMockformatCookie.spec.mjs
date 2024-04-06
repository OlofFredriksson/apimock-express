import { expect } from "chai";
import request from "request";
import { hostname } from "../../test-server.mjs";

describe("Advanced mockformat", function () {
    describe("Cookies", function () {
        it("Should return the response for the first cookie match", function (done) {
            const headers = {
                Cookie: "foo=foo",
            };
            request.get(
                `http://${hostname}/api/advanced/cookie`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(400);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"foo"}');
                    done();
                },
            );
        });

        it("Should return the response for the second cookie match", function (done) {
            const headers = {
                Cookie: "foo=bar",
            };
            request.get(
                `http://${hostname}/api/advanced/cookie`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"bar"}');
                    done();
                },
            );
        });

        it("Should return the default response if no match", function (done) {
            const headers = {
                Cookie: "asdf=asdf",
            };
            request.get(
                `http://${hostname}/api/advanced/cookie`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"foofoofoo"}');
                    done();
                },
            );
        });

        it("Should return the default response if no cookies in mockfile", function (done) {
            const headers = {
                Cookie: "foo=foo",
            };
            request.get(
                `http://${hostname}/api/advanced/cookie_no_cookies`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"foofoofoo"}');
                    done();
                },
            );
        });

        it("Should return the default response if no cookies in request", function (done) {
            const headers = {};
            request.get(
                `http://${hostname}/api/advanced/cookie`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"foofoofoo"}');
                    done();
                },
            );
        });
    });
});
