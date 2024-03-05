const fs = require("fs");
const chai = require("chai");
const request = require("request");

const expect = chai.expect;

describe("Url matching", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("A correct url that starts with mock url should match", function (done) {
        const expectedBody = fs.readFileSync("test/api/simple/users.json", {
            encoding: "utf-8",
        });
        request.get(
            `http://${hostname}/api/simple/users/`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.equal(expectedBody);
                done();
            },
        );
    });

    it("Must start with the mock url", function (done) {
        //The url matches but not in the beginning
        const expectedBody = "Cannot GET /foo/api/simple/users/";
        request.get(
            `http://${hostname}/foo/api/simple/users/`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(body).to.contain(expectedBody);
                done();
            },
        );
    });

    it("A incorrect url should not match", function (done) {
        const expectedBody = "Cannot GET /foo/simple/users/";
        request.get(
            `http://${hostname}/foo/simple/users/`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(404);
                expect(body).to.contain(expectedBody);
                done();
            },
        );
    });
});
