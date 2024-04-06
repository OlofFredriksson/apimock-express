import { expect } from "chai";
import request from "request";
import { hostname } from "../../test-server.mjs";

describe("Wildcard", function () {
    it("should pick wildcard file for GET if specific not found", function (done) {
        const requestbody = {};
        request.get(
            `http://${hostname}/api/wildcard/123`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({ message: "Wildcard GET" });
                done();
            },
        );
    });

    it("should pick wildcard file for POST if specific not found", function (done) {
        const requestbody = {};
        request.post(
            `http://${hostname}/api/wildcard/123`,
            { json: requestbody },
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.deep.equal({ message: "Wildcard POST" });

                done();
            },
        );
    });
});
