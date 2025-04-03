import { defineMock } from "../../dist/helpers.mjs";

export default defineMock({
    meta: {
        url: "/private/foo/basic",
        method: "POST",
    },
    defaultResponse: {
        body: {
            post: "bar",
        },
    },
});
