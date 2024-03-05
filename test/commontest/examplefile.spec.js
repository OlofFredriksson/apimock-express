const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("Examplefile", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("Nothing matches", function (done) {
        const requestbody = {};
        request.post(
            `http://${hostname}/api/examplefile`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(201);
                expect(body).to.deep.equal({
                    message: "Nothing matches. Default response",
                });
                done();
            },
        );
    });

    it("One request parameter matches", function (done) {
        const requestbody = {};
        request.post(
            `http://${hostname}/api/examplefile?foo=bar`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(402);
                expect(body).to.deep.equal({
                    message: "One parameter matches",
                });
                done();
            },
        );
    });

    it("Two request parameters matches", function (done) {
        const requestbody = {};
        request.post(
            `http://${hostname}/api/examplefile?foo=bar&bar=foo`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(401);
                expect(body).to.deep.equal({
                    message: "Two parameters matches",
                });
                done();
            },
        );
    });

    it("One body parameter matches", function (done) {
        const requestbody = { foo: "foo" };
        request.post(
            `http://${hostname}/api/examplefile`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(body).to.deep.equal({
                    message: "One body parameter matches",
                });
                done();
            },
        );
    });

    it("Two body parameters matches", function (done) {
        const requestbody = {
            user: { firstname: "Luke", lastname: "Skywalker" },
        };
        request.post(
            `http://${hostname}/api/examplefile`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(403);
                expect(body).to.deep.equal({
                    message: "Two body parameters matches",
                });
                done();
            },
        );
    });

    it("Both request parameter and body matches", function (done) {
        const requestbody = { bar: "foo" };
        request.post(
            `http://${hostname}/api/examplefile?foo=bar`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(400);
                expect(body).to.deep.equal({
                    message: "Both parameter and body matches",
                });
                done();
            },
        );
    });

    it("One body parameter matches. Default status", function (done) {
        const requestbody = { foo: "bar" };
        request.post(
            `http://${hostname}/api/examplefile`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({
                    message: "One body parameter matches. Default status",
                });
                done();
            },
        );
    });
});
