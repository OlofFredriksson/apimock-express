const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("Advanced mockformat", function () {
    let server;
    let hostname;

    before(function () {
        server = require("../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    describe("Headers", function () {
        it("POST /headers/sign should respond with 302 redirect", function (done) {
            request.post(
                `http://${hostname}/headers/redirect`,
                function (err, res) {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal("http://google.com");
                    done();
                },
            );
        });
    });
});
