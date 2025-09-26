export default {
    responses: [
        {
            request() {
                return true;
            },
            response: {
                body: {
                    foo: "bar",
                },
            },
        },
    ],
    defaultResponse: {
        body: {
            error: "request didn't match",
        },
    },
};
