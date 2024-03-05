const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("Relative path mocks", function () {
    let server;
    let hostname;

    before(function () {
        server = require("../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("GET - should find json file", function (done) {
        request.get(
            `http://${hostname}/relative-path/relative-json`,
            function (err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            },
        );
    });

    it("GET - should find js file", function (done) {
        request.get(
            `http://${hostname}/relative-path/relative-js`,
            function (err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            },
        );
    });
});
