import { expect } from "chai";
import request from "request";
import { hostname } from "../../test-server.mjs";

describe("Advanced mockformat", function () {
    const DELAY_TIME = 1000;

    describe("Delay", function () {
        it("GET /api/advanced/delay?foo=bar should not be delayed", function (done) {
            const starttime = new Date();
            request.get(
                `http://${hostname}/api/advanced/delay?foo=bar`,
                function (err, res, body) {
                    const endtime = new Date();
                    const executionTime =
                        endtime.getTime() - starttime.getTime();
                    expect(res.statusCode).to.equal(200);
                    expect(body).to.equal('{"message":"default"}');
                    expect(executionTime).to.be.at.most(DELAY_TIME);
                    done();
                },
            );
        });

        it("GET /api/advanced/delay?foo=foo should be delayed", function (done) {
            const starttime = new Date();
            request.get(
                `http://${hostname}/api/advanced/delay?foo=foo`,
                function (err, res, body) {
                    const endtime = new Date();
                    const executionTime =
                        endtime.getTime() - starttime.getTime();
                    expect(res.statusCode).to.equal(200);
                    expect(body).to.equal('{"message":"delayed"}');
                    expect(executionTime).to.be.at.least(DELAY_TIME);
                    done();
                },
            );
        });
    });
});
