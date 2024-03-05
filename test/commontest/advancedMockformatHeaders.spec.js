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

    describe("Headers", function () {
        it("Should return the second response if one matches", function (done) {
            const headers = {
                header1: "one",
                header2: "2",
            };
            request.get(
                `http://${hostname}/api/advanced/requestheaders`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(402);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"one"}');
                    done();
                },
            );
        });

        it("Should return the first response if both matches", function (done) {
            const headers = {
                header1: "one",
                header2: "two",
            };
            request.get(
                `http://${hostname}/api/advanced/requestheaders`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(401);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"onetwo"}');
                    done();
                },
            );
        });

        it("Should return the first response if two of three matches", function (done) {
            const headers = {
                header1: "one",
                header2: "two",
                header3: "three",
            };
            request.get(
                `http://${hostname}/api/advanced/requestheaders`,
                { headers: headers },
                function (err, res, body) {
                    expect(res.statusCode).to.equal(401);
                    expect(res.headers["content-type"]).to.equal(
                        "application/json;charset=UTF-8",
                    );
                    expect(body).to.equal('{"message":"onetwo"}');
                    done();
                },
            );
        });

        it("Should return the default response if no matches", function (done) {
            const headers = {
                header1: "foo",
                header2: "bar",
            };
            request.get(
                `http://${hostname}/api/advanced/requestheaders`,
                { headers: headers },
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
