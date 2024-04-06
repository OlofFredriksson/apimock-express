import { expect } from "chai";
import request from "request";
import { hostname } from "../../test-server.mjs";

describe("Advanced mockformat", function () {
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
