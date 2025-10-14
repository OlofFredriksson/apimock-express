// @vitest-environment happy-dom
/* global document */

import { afterEach, describe, expect, test, vi } from "vitest";
import { matchResponseBrowser } from "../../src/browser";
import basicMock from "./basicMock.mjs";
import basicMockPost from "./basicMockPost.mjs";

describe("Browser", function () {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe("Basic", function () {
        const config = {
            mockdata: [basicMock, basicMockPost],
            requestUrl: "/private/foo/basic",
            method: "GET",
            bodyParameters: {},
            headers: undefined,
        };

        test("Should get default GET-response", async () => {
            const response = matchResponseBrowser(config);
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
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        test("Should get specific GET-response", async () => {
            const customConfig = {
                ...config,
                requestUrl: "/private/foo/basic?foo=bar&bar=foo",
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { message: "foobar" },
                status: 401,
                delay: 0,
            });
        });

        test("Should get specific GET-response based on cookies", async () => {
            vi.spyOn(document, "cookie", "get").mockImplementation(
                () => "foo=bar",
            );
            const customConfig = {
                ...config,
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: "cookies",
                status: 200,
                delay: 0,
            });
        });

        test("Should get default POST-response", async () => {
            const customConfig = { ...config, method: "POST" };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { post: "bar" },
                delay: 0,
                status: 200,
            });
        });
    });
});
