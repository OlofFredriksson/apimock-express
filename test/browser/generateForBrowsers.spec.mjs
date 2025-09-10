import { describe, expect, test } from "vitest";
import { generateForBrowser } from "../../src/main";
import { matchResponse } from "../../src/browser";


describe("generateForBrowser", function () {
    describe("generateForBrowser", function () {
        const mockData = generateForBrowser(
            process.cwd(),
            "test/generateForBrowser",
        );
        const config = {
            mockdata: mockData,
            requestUrl: "/deeply/private/fancyApi",
            method: "GET",
            bodyParameters: {},
            headers: undefined,
        };
        test("Should return undefined if no match", async () => {
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
    });

    describe("generateForBrowser", function () {
        const mockData = generateForBrowser(
            process.cwd(),
            "test/generateForBrowser",
        );
        console.log(mockData);
        const config = {
            mockdata: mockData,
            requestUrl: "/deeply/private/json",
            method: "GET",
            bodyParameters: {},
            headers: undefined,
        };
        test("Should return undefined if no match", async () => {
            const customConfig = {
                ...config,
            };
            const response = matchResponse(customConfig);
            expect(response).to.deep.equal({
                body: {
                    foo: "json",
                },
            });
        });
    });
});
