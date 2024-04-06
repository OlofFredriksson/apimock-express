import { expect } from "chai";
import request from "request";
import { hostname } from "../../test-server.mjs";

describe("Advanced mockformat", function () {
    describe("Bodyparameter", function () {
        it("Should return the response for the first bodyparamter match", function (done) {
            const requestbody = { foo: "foo" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(402);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foo" });
                    done();
                },
            );
        });

        it("Should return the response for the second bodyparamter match", function (done) {
            const requestbody = { foo: "bar" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "bar" });
                    done();
                },
            );
        });

        it("Should return the default response if no match in bodyparameter value", function (done) {
            const requestbody = { foo: "asdf" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foofoofoo" });
                    done();
                },
            );
        });

        it("Should return the default response if no match in bodyparameter name", function (done) {
            const requestbody = { bar: "asdf" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foofoofoo" });
                    done();
                },
            );
        });

        it("Should return an error if no match and no default response", function (done) {
            const requestbody = { foo: "asdf" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_no_defaultresponse`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(500);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({
                        error: "No response could be found",
                    });
                    done();
                },
            );
        });

        it("Should return the default response if no bodyparameters in mockfile", function (done) {
            const requestbody = { foo: "bar" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_no_parameters`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foofoofoo" });
                    done();
                },
            );
        });
    });

    describe("Complex Bodyparameter", function () {
        it("Should match two parameters on second level", function (done) {
            const requestbody = {
                user: {
                    firstname: "Luke",
                    lastname: "Skywalker",
                    address: { street: "Milkyway", zipcode: "12345" },
                },
                foo: "foo",
            };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(500);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({
                        message: "Level 2. Firstname and lastname matches",
                    });
                    done();
                },
            );
        });

        it("Should match one parameter on second level", function (done) {
            const requestbody = {
                user: {
                    firstname: "Luke",
                    lastname: "Macahan",
                    address: { street: "Milkyway", zipcode: "12345" },
                },
                foo: "foo",
            };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(501);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({
                        message: "Level 2. Firstname matches",
                    });
                    done();
                },
            );
        });

        it("Should match one parameter on third level", function (done) {
            const requestbody = {
                user: {
                    firstname: "Zeb",
                    lastname: "Macahan",
                    address: { street: "The wild west", zipcode: "55555" },
                },
                foo: "foo",
            };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(502);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({
                        message: "Level 3. zipcode matches",
                    });
                    done();
                },
            );
        });

        it("Should match one parameter on first level", function (done) {
            const requestbody = {
                user: {
                    firstname: "Zeb",
                    lastname: "Macahan",
                    address: { street: "The wild west", zipcode: "12345" },
                },
                foo: "bar",
            };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(503);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({
                        message: "Level 1. foo matches",
                    });
                    done();
                },
            );
        });

        it("Should handle a request that do not contain all of the mock parameters", function (done) {
            const requestbody = { foo: "bar" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(503);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({
                        message: "Level 1. foo matches",
                    });
                    done();
                },
            );
        });

        it("Should return the default answer if no match", function (done) {
            const requestbody = { asdf: "asdf" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({
                        message: "No match, default response",
                    });
                    done();
                },
            );
        });
    });

    describe("Bodyparameters", function () {
        it("Should return the default answer if only one of two bodyparameters matches", function (done) {
            const requestbody = { foo: "bar" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameters`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foofoofoo" });
                    done();
                },
            );
        });

        it("Should return the answer for both bodyparameters match", function (done) {
            const requestbody = { foo: "bar", bar: "foo" };
            request.post(
                `http://${hostname}/api/advanced/bodyparameters`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(403);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foobar" });
                    done();
                },
            );
        });
    });

    describe("Bodyparameter and requestparameter", function () {
        it("Should return the default answer if only the requestparameter matches", function (done) {
            const requestbody = { asdf: "asdf" };
            request.post(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?foo=bar`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foofoofoo" });
                    done();
                },
            );
        });

        it("Should return the default answer if only the bodyparameter matches", function (done) {
            const requestbody = { bar: "foo" };
            request.post(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?asdf=asdf`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foofoofoo" });
                    done();
                },
            );
        });

        it("Should return the answer for requestparameter and bodyparameter match", function (done) {
            const requestbody = { bar: "foo" };
            request.post(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?foo=bar`,
                { json: requestbody },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(404);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.deep.equal({ message: "foobar" });
                    done();
                },
            );
        });
    });
});
