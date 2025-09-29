import { describe, expect, test } from "vitest";
import { generateForBrowser } from "../../src/main";
import { appendBasePath, matchResponse, generateMock } from "../../src/browser";

async function testGenerateMock(apiDirectory, userOptions = {}) {
    /** To be run in a Node Context */
    const preparedMockData = await generateForBrowser(
        apiDirectory,
        userOptions,
    );

    /** To be run in a Browser Context */
    return await generateMock(preparedMockData);
}

const config = {
    mockdata: await testGenerateMock("test/generateForBrowser"),
    requestUrl: "/deeply/private/fancyApi",
    method: "GET",
    bodyParameters: {},
    headers: undefined,
};

describe("generateForBrowser", function () {
    describe("generateForBrowser", function () {
        test("Should return default response for .js", async () => {
            const customConfig = {
                ...config,
            };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    foo: "bar",
                },
                delay: 0,
                status: 200,
            });
        });

        test("Should return post", async () => {
            const customConfig = {
                ...config,
            };
            customConfig.requestUrl = "/deeply/private/fancyApi";
            customConfig.method = "POST";
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    message: "file uploaded with fancy api",
                },
                delay: 0,
                status: 200,
            });
        });

        test("Should return default response for .json", async () => {
            const customConfig = {
                ...config,
            };
            customConfig.requestUrl = "/deeply/private/json";
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    foo: "json",
                },
                delay: 0,
                status: 200,
            });
        });

        test("Should return default response for .cjs", async () => {
            const customConfig = {
                ...config,
            };
            customConfig.requestUrl = "/deeply/private/commonjs";
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    foo: "cjs",
                },
                delay: 0,
                status: 200,
            });
        });

        test("Should return default response for .esm", async () => {
            const customConfig = {
                ...config,
            };
            customConfig.requestUrl = "/deeply/private/esm";
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    foo: "esm",
                },
                delay: 0,
                status: 200,
            });
        });

        test("Should be able to define base api path", async () => {
            const customConfig = {
                ...config,
            };
            customConfig.mockdata = await testGenerateMock(
                "test/generateForBrowser",
                {
                    rootPath: process.cwd(),
                    baseApiPath: "api/prefix",
                },
            );
            customConfig.requestUrl = "api/prefix/deeply/private/commonjs";
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    foo: "cjs",
                },
                delay: 0,
                status: 200,
            });
        });

        test("Should be able to append a basePath afterwards with using appendBasePath", async () => {
            const customConfig = {
                ...config,
            };
            customConfig.mockdata = await testGenerateMock(
                "test/generateForBrowser",
                {
                    rootPath: process.cwd(),
                },
            );
            customConfig.requestUrl = "api/prefix/deeply/private/commonjs";

            customConfig.mockdata = appendBasePath(
                customConfig.mockdata,
                "api/prefix",
            );
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    foo: "cjs",
                },
                delay: 0,
                status: 200,
            });
        });
    });
});
