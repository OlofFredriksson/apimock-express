const chai = require("chai");

const expect = chai.expect;
const request = require("request");

describe("js mocks", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("plain file", function (done) {
        const requestbody = {};
        request.post(
            `http://${hostname}/api/js/file`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({
                    foo: "bar",
                });
                done();
            },
        );
    });

    it("default export", function (done) {
        const requestbody = {};
        request.post(
            `http://${hostname}/api/js/default-export`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({
                    foo: "bar",
                });
                done();
            },
        );
    });
    it("remove relativ path for error message, file not found", () => {
        expect("../../app/private/../v1".replace(/^(?:\.\.\/)+/, "")).to.equal(
            "app/private/../v1",
        );
    });
});
