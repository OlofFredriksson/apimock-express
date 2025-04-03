import { defineMock } from "../../src/helpers";

export default defineMock({
    meta: {
        url: "/private/foo/basic",
        method: "GET",
    },
    responses: [
        {
            request: {
                parameters: {
                    foo: "bar",
                    bar: "foo",
                },
            },
            response: {
                status: 401,
                body: {
                    message: "foobar",
                },
            },
        },
        {
            request: {
                cookies: {
                    foo: "bar",
                },
            },
            response: {
                status: 200,
                body: "cookies",
            },
        },
        {
            request: {
                headers: { bar: "foo" },
            },
            response: {
                status: 200,
                body: "headers",
            },
        },
    ],
    defaultResponse: {
        body: {
            foo: "bar",
        },
    },
});
