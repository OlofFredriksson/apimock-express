import { expect } from "chai";
import { hostname } from "../../test-server.mjs";

describe("Intercepted call", function () {
    it("Should handle when an earlier middleware intercepts request body", async () => {
        const res = await fetch(`http://${hostname}/api/intercepted`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({ id: "api" });
    });
});
