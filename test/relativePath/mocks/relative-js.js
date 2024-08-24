const { defineMock } = require("../../../src/helpers");

module.exports = {
    default: defineMock({
        defaultResponse: {
            body: {
                id: "relativeJs",
            },
        },
    }),
};
