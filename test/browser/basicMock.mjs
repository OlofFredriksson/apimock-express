import { defineMock } from "../../dist/helpers.mjs";

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
    ],
    defaultResponse: {
        body: {
            foo: "bar",
        },
    },
});
