const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("Wildcard", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("should pick wildcard file for GET if specific not found", function (done) {
        const requestbody = {};
        request.get(
            `http://${hostname}/api/wildcard/123`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({ message: "Wildcard GET" });
                done();
            },
        );
    });

    it("should pick wildcard file for POST if specific not found", function (done) {
        const requestbody = {};
        request.post(
            `http://${hostname}/api/wildcard/123`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({ message: "Wildcard POST" });

                done();
            },
        );
    });
});
