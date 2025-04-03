import Module from "node:module";
import { expect } from "chai";
import basicMock from "./basicMock.mjs";
import basicMockPost from "./basicMockPost.mjs";

const require = Module.createRequire(import.meta.url);
const module = require("../../src/browser");

describe("Browser", function () {
    describe("Basic", function () {
        const config = {
            mockdata: [basicMock, basicMockPost],
            requestUrl: "/private/foo/basic",
            method: "GET",
            requestParameters: undefined,
            bodyParameters: {},
            headers: undefined,
            cookies: {},
        };
        it("Should get default GET-response", async () => {
            const response = module.matchResponse(config);
            expect(response).to.deep.equal({ body: { foo: "bar" } });
        });

        it("Should remove query params in url", async () => {
            const customConfig = {
                ...config,
                requestUrl: "/private/foo/basic?foo=bar",
            };
            const response = module.matchResponse(customConfig);
            expect(response).to.deep.equal({ body: { foo: "bar" } });
        });

        it("Should get specific GET-response", async () => {
            const customConfig = {
                ...config,
                requestParameters: { foo: "bar", bar: "foo" },
            };
            const response = module.matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: { message: "foobar" },
                status: 401,
            });
        });

        it("Should get specific GET-response based on cookies", async () => {
            const customConfig = {
                ...config,
                cookies: { foo: "bar" },
            };
            const response = module.matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: "cookies",
                status: 200,
            });
        });

        it("Should get default POST-response", async () => {
            const customConfig = { ...config, method: "POST" };
            const response = module.matchResponse(customConfig);
            expect(response).to.deep.equal({ body: { post: "bar" } });
        });
    });
});
