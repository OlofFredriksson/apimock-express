import { type MiddlewareConfiguration } from "./middleware-configuration";

/**
 * Options for Vite plugin.
 */
export interface VitePluginOptions extends MiddlewareConfiguration {
    /**
     * Enable/disable plugin. Can optionally be set to which command to enable
     * the plugin for. Default is `true` (enabled for all commands).
     */
    enabled?: "serve" | "preview" | boolean;
}
