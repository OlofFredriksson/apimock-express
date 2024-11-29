import { defineConfig } from "vite";
import { vitePlugin } from "../../src/main";

export default defineConfig({
    clearScreen: false,
    root: "test/vite",
    server: {
        host: "127.0.0.1",
    },
    plugins: [vitePlugin({ dir: "test/vite/mock", url: "/api" })],
});
