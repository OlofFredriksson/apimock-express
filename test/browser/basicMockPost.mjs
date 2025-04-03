import { defineMock } from "../../src/helpers";

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
