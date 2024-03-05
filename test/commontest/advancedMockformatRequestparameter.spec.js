const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("Advanced mockformat", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    describe("Requestparameter", function () {
        it("Should return the response for the first requestparameter match", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameter?foo=foo`,
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

        it("Should return the response for the second requestparameter match", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameter?foo=bar`,
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

        it("Should return the default response if no match in requestparameter value", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameter?foo=asdf`,
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

        it("Should return the default response if no match in requestparameter name", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameter?bar=asdf`,
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

        it("Should return an error if no match and no default response", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameter_no_defaultresponse`,
                function (err, res, body) {
                    expect(res.statusCode).to.equal(500);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal(
                        '{"error":"No response could be found"}',
                    );
                    done();
                },
            );
        });

        it("Should return the default response if no requestparameters in mockfile", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameter_no_parameters`,
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

    describe("Requestparameters", function () {
        it("Should return the default response if only one of two requestparameters matches", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameters?foo=bar`,
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

        it("Should return the answer for both requestparameters match", function (done) {
            request.get(
                `http://${hostname}/api/advanced/requestparameters?foo=bar&bar=foo`,
                function (err, res, body) {
                    expect(res.statusCode).to.equal(401);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"foobar"}');
                    done();
                },
            );
        });
    });
});
