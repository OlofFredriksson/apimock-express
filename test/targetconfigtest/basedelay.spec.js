const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("Basedelay", function () {
    const DELAY_TIME = 1000;

    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    describe("simple mockformat", function () {
        it("GET /api2/hello should not be delayed", function (done) {
            const starttime = new Date();
            const expectedBody = '{ "id": "api" }\n';
            request.get(
                `http://${hostname}/api2/hello`,
                function (err, res, body) {
                    const endtime = new Date();
                    const executionTime =
                        endtime.getTime() - starttime.getTime();
                    expect(res.statusCode).to.equal(200);
                    expect(body).to.equal(expectedBody);
                    expect(executionTime).to.be.at.most(DELAY_TIME);
                    done();
                },
            );
        });

        it("GET /apiX/hello should be delayed", function (done) {
            const starttime = new Date();
            const expectedBody = '{ "id": "apiX" }\n';
            request.get(
                `http://${hostname}/apiX/hello`,
                function (err, res, body) {
                    const endtime = new Date();
                    const executionTime =
                        endtime.getTime() - starttime.getTime();
                    expect(res.statusCode).to.equal(200);
                    expect(body).to.equal(expectedBody);
                    expect(executionTime).to.be.at.least(DELAY_TIME);
                    done();
                },
            );
        });
    });

    describe("advanced mockformat", function () {
        it("GET /api2/helloAdv should not be delayed", function (done) {
            const starttime = new Date();
            const expectedBody = '{"id":"api"}';
            request.get(
                `http://${hostname}/api2/helloAdv`,
                function (err, res, body) {
                    const endtime = new Date();
                    const executionTime =
                        endtime.getTime() - starttime.getTime();
                    expect(res.statusCode).to.equal(200);
                    expect(body).to.equal(expectedBody);
                    expect(executionTime).to.be.at.most(DELAY_TIME);
                    done();
                },
            );
        });

        it("GET /apiX/helloAdv should be delayed", function (done) {
            const starttime = new Date();
            const expectedBody = '{"id":"apiX"}';
            request.get(
                `http://${hostname}/apiX/helloAdv`,
                function (err, res, body) {
                    const endtime = new Date();
                    const executionTime =
                        endtime.getTime() - starttime.getTime();
                    expect(res.statusCode).to.equal(200);
                    expect(body).to.equal(expectedBody);
                    expect(executionTime).to.be.at.least(DELAY_TIME);
                    done();
                },
            );
        });
    });
});
