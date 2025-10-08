export default {
    defaultResponse(req) {
        const statusCode = 200 + 1;
        return {
            status: statusCode,
            body: req,
            delay: 0,
        };
    },
};
