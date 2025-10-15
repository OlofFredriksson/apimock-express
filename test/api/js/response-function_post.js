export default {
    defaultResponse(req) {
        const statusCode = 200 + 1;
        const returnBody = req.body.replace("request", "response");
        return {
            headers: {
                "Content-Type": "text/plain",
            },
            status: statusCode,
            body: returnBody,
            delay: 0,
        };
    },
};
