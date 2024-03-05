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

    describe("Errors", function () {
        it("Should return an empty string for an empty file", function (done) {
            request.get(
                `http://${hostname}/api/advanced/emptyfile`,
                function (err, res, body) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal("");
                    done();
                },
            );
        });

        it("Should return the default response if only default response", function (done) {
            request.get(
                `http://${hostname}/api/advanced/only_defaultresponse`,
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

        it("Should return an empty string if no body in only default response", function (done) {
            request.get(
                `http://${hostname}/api/advanced/only_defaultresponse_no_body`,
                function (err, res, body) {
                    expect(res.statusCode).to.equal(201);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal("");
                    done();
                },
            );
        });

        it("Should return the default status if no status in only default response", function (done) {
            request.get(
                `http://${hostname}/api/advanced/only_defaultresponse_no_status`,
                function (err, res, body) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"foofoofoo"}');
                    done();
                },
            );
        });

        it("Should return an error if the file is malformed", function (done) {
            request.get(
                `http://${hostname}/api/advanced/malformedfile`,
                function (err, res, body) {
                    expect(res.statusCode).to.equal(500);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal(
                        '{"error":"Malformed mockfile. See server log"}',
                    );
                    done();
                },
            );
        });

        it("Should return an error if the input body is malformed", function (done) {
            const headers = {};
            headers["Content-type"] = "application/json";
            const options = { body: "{", headers: headers };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter`,
                options,
                function (err, res, body) {
                    expect(res.statusCode).to.equal(500);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"error":"Malformed input body"}');
                    done();
                },
            );
        });

        it("Should not parse the body, but return the default response if input body is not json", function (done) {
            const headers = {};
            headers["Content-type"] = "application/x-www-form-urlencoded";
            const options = { body: "foo=bar", headers: headers };
            request.post(
                `http://${hostname}/api/advanced/bodyparameter`,
                options,
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
