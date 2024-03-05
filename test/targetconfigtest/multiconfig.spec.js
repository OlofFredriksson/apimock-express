const fs = require("fs");
const chai = require("chai");
const request = require("request");

const expect = chai.expect;

describe("Multiconfig", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("Local config GET /api2/simple/users/ should return test/api/simple/users.json", function (done) {
        const expectedBody = fs.readFileSync("test/api/simple/users.json", {
            encoding: "utf-8",
        });
        request.get(
            `http://${hostname}/api2/simple/users/`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.equal(expectedBody);
                done();
            },
        );
    });

    it("Multiple config GET /api2/hello should return test/api/hello.json", function (done) {
        const expectedBody = '{ "id": "api" }\n';
        request.get(`http://${hostname}/api2/hello`, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal(expectedBody);
            done();
        });
    });

    it("Multiple config GET /apiX/hello should return test/apiX/hello.json", function (done) {
        const expectedBody = '{ "id": "apiX" }\n';
        request.get(`http://${hostname}/apiX/hello`, function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal(expectedBody);
            done();
        });
    });
});
