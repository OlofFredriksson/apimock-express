const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("Intercepted call", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("Should handle when an earlier middleware intercepts request body", function (done) {
        const requestbody = { foo: "bar" };
        request.get(
            `http://${hostname}/api/intercepted`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({ id: "api" });
                done();
            },
        );
    });
});
