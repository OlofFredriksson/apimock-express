export default {
    defaultResponse(req) {
        const statusCode = 200 + 1;
        const returnBody = req.body.replace("request", "response");
        return {
            status: statusCode,
            body: returnBody,
            delay: 0,
        };
    },
};
