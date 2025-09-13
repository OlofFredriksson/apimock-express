import { describe, expect, test } from "vitest";
import { generateForBrowser } from "../../src/main";
import { matchResponse } from "../../src/browser";

const mockData = await generateForBrowser("test/generateForBrowser", {
    rootPath: process.cwd(),
});
const config = {
    mockdata: mockData,
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
            });
        });

        test("Should be able to define base api path .cjs", async () => {
            const customConfig = {
                ...config,
            };
            customConfig.mockdata = await generateForBrowser(
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
            });
        });
    });
});
