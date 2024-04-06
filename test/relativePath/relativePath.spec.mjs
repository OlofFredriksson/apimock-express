import { expect } from "chai";
import request from "request";
import { hostname } from "../../test-server.mjs";

describe("Relative path mocks", function () {
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
