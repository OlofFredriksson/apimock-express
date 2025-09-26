import { state } from "./body-fn-global.mjs";

export default {
    meta: {
        url: "/advanced/post-mock",
        method: "POST",
    },
    defaultResponse: {
        body(req) {
            const key = req.headers["breadcrumb-id"];
            state.value.set(key, req.body);
            return {};
        },
    },
};
