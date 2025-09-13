import { describe, expect, test } from "vitest";
import { matchResponse } from "../../src/browser";
import basicMock from "./basicMock.mjs";
import basicMockPost from "./basicMockPost.mjs";

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

        test("Should return undefined if no match", async () => {
            const customConfig = {
                ...config,
                requestUrl: "404",
            };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal(undefined);
        });

        test("Should get default GET-response", async () => {
            const response = matchResponse(config);
            expect(response).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        test("Should remove query params in url", async () => {
            const customConfig = {
                ...config,
                requestUrl: "/private/foo/basic?foo=bar",
            };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        test("Should get specific GET-response", async () => {
            const customConfig = {
                ...config,
                requestParameters: { foo: "bar", bar: "foo" },
            };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: { message: "foobar" },
                status: 401,
                delay: 0,
            });
        });

        test("Should get specific GET-response based on cookies", async () => {
            const customConfig = {
                ...config,
                cookies: { foo: "bar" },
            };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: "cookies",
                status: 200,
                delay: 0,
            });
        });

        test("Should get specific GET-response based on headers", async () => {
            const customConfig = {
                ...config,
                headers: { bar: "foo" },
            };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: "headers",
                status: 200,
                delay: 0,
            });
        });

        test("Should get default POST-response", async () => {
            const customConfig = { ...config, method: "POST" };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: { post: "bar" },
                delay: 0,
                status: 200,
            });
        });
    });
});
