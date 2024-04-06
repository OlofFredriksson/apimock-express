import { expect } from "chai";
import request from "request";
import { hostname } from "../../test-server.mjs";

describe("Intercepted call", function () {
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
