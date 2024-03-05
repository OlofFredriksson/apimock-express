const { defineMock } = require("../../../helpers");

module.exports = {
    default: defineMock({
        defaultResponse: {
            body: {
                id: "relativeJs",
            },
        },
    }),
};
