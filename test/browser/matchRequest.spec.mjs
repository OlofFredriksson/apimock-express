// @vitest-environment happy-dom
/* global document */
import { describe, expect, test, vi } from "vitest";
import { matchRequest } from "../../src/browser";
import advancedGetMock from "../api/js/body-fn.mjs";
import advancedPostMock from "../api/js/body-fn_post.mjs";
import basicMock from "./basicMock.mjs";
import basicMockPost from "./basicMockPost.mjs";

async function getMockResponse(url, method = "GET", headers = {}, body) {
    const req = new Request(url, { method, headers, body });
    return await matchRequest(
        [basicMock, basicMockPost, advancedPostMock, advancedGetMock],
        req,
    );
}

describe("Browser", function () {
    describe("matchMockByRequest", function () {
        test("Should return 404 response if no match", async () => {
            const response = await getMockResponse("/not-found", "GET", {
                "Content-Type": "application/json",
            });
            expect(response).toStrictEqual({
                body: {
                    response:
                        "default 404 - @forsakringskassan/apimock-express",
                },
                delay: 0,
                label: "Mock 404 response",
                status: 404,
            });
        });

        test("Should get specific post request", async () => {
            const response = await getMockResponse(
                "/private/foo/basic?foo=bar",
                "POST",
                { "Content-Type": "application/json" },
            );
            expect(response).toStrictEqual({
                body: { post: "bar" },
                delay: 0,
                status: 200,
            });
        });

        test("Should be able to find mocks based on cookies", async () => {
            vi.spyOn(document, "cookie", "get").mockImplementation(
                () => "foo=bar",
            );
            const response = await getMockResponse(
                "/private/foo/basic",
                "GET",
                { "Content-Type": "application/json" },
            );
            expect(response).to.deep.equal({
                body: "cookies",
                status: 200,
                delay: 0,
            });
        });

        test("should be able to save multiple binary blob text", async () => {
            const abc = new Blob(["Apimock"], { type: "text/plain" });
            const formData = new FormData();
            formData.append("text", abc, "text.txt");
            formData.append("another-file", abc, "file.txt");
            await getMockResponse(
                "/advanced/post-mock",
                "POST",
                {
                    "BREADCRUMB-ID": "blob-text",
                },
                formData,
            );
            const response = await getMockResponse(
                "/advanced/reading-mock",
                "GET",
                { "BREADCRUMB-ID": "blob-text" },
            );
            expect(response).to.deep.equal({
                body: [
                    { contentType: "text/plain", fileName: "blob" },
                    { contentType: "text/plain", fileName: "blob" },
                ],
                delay: 0,
                status: 200,
            });
        });
    });
});
