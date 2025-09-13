// @vitest-environment happy-dom
/* global document */

import { describe, expect, test, vi } from "vitest";
import { matchResponseBrowser } from "../../src/browser";
import basicMock from "./basicMock.mjs";
import basicMockPost from "./basicMockPost.mjs";

describe("Browser", function () {
    describe("matchResponseBrowser", function () {
        const config = {
            mockdata: [basicMock, basicMockPost],
            requestUrl: "/private/foo/basic",
            method: "GET",
            bodyParameters: {},
            headers: undefined,
        };

        test("Should return 404 response if no match", async () => {
            const customConfig = {
                ...config,
                requestUrl: "404",
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: {
                    response:
                        "default 404 - @forsakringskassan/apimock-express",
                },
                delay: 0,
                label: "Mock 404 response",
                status: 404,
            });
        });

        test("Should get default GET-response", async () => {
            const response = matchResponseBrowser(config);
            expect(response).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        test("Should be able to find mocks based on cookies", async () => {
            vi.spyOn(document, "cookie", "get").mockImplementation(
                () => "foo=bar",
            );
            const response = matchResponseBrowser(config);
            expect(response).to.deep.equal({
                body: "cookies",
                status: 200,
                delay: 0,
            });
        });

        test("Should be able to find mocks query params", async () => {
            const customConfig = {
                ...config,
                requestUrl: "/private/foo/basic?bar=foo&foo=bar",
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { message: "foobar" },
                status: 401,
                delay: 0,
            });
        });
    });
});
