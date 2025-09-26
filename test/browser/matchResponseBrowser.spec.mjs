// @vitest-environment happy-dom
/* global document */

import { describe, expect, test, vi } from "vitest";
import { matchResponseBrowser } from "../../src/browser";
import advancedPostMock from "../api/js/body-fn_post.mjs";
import advancedGetMock from "../api/js/body-fn.mjs";
import basicMock from "./basicMock.mjs";
import basicMockPost from "./basicMockPost.mjs";

describe("Browser", function () {
    describe("matchResponseBrowser", function () {
        const config = {
            mockdata: [
                basicMock,
                basicMockPost,
                advancedPostMock,
                advancedGetMock,
            ],
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

        test("Should be able to send in full url", async () => {
            const customConfig = {
                ...config,
                requestUrl: "https://example.net/private/foo/basic?foo=bar",
            };

            expect(matchResponseBrowser(customConfig)).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });

            customConfig.requestUrl =
                "https://example.net:1337/private/foo/basic?foo=bar";
            expect(matchResponseBrowser(customConfig)).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
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

        describe("Mock saving values to a global state", () => {
            test("should get default value when no data saved", async () => {
                const customConfig = {
                    ...config,
                    requestUrl: "/advanced/reading-mock",
                };
                const response = matchResponseBrowser(customConfig);
                expect(response).to.deep.equal({
                    body: { no: "data-saved" },
                    status: 200,
                    delay: 0,
                });
            });

            test("should be able to post data and then retrieve the value", async () => {
                let customConfig = {
                    ...config,
                    requestUrl: "/advanced/post-mock",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "BREADCRUMB-ID": "foo",
                    },
                    body: JSON.stringify({ hej: "1" }),
                };
                matchResponseBrowser(customConfig);

                customConfig = {
                    ...config,
                    requestUrl: "/advanced/post-mock",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "BREADCRUMB-ID": "bar",
                    },
                    body: JSON.stringify({ hej: "2" }),
                };
                matchResponseBrowser(customConfig);

                /* Get first saved value based by BREADCRUMB-ID */
                customConfig = {
                    ...config,
                    requestUrl: "/advanced/reading-mock",
                    headers: {
                        "Content-Type": "application/json",
                        "BREADCRUMB-ID": "foo",
                    },
                };
                const response = matchResponseBrowser(customConfig);
                expect(response).to.deep.equal({
                    body: { hej: "1" },
                    status: 200,
                    delay: 0,
                });
            });
        });
    });
});
