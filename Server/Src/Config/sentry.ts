import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export const initSentry = () => {
    if (!process.env.SENTRY_DSN) {
        console.warn('SENTRY_DSN not found in environment variables. Sentry will not be initialized.');
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            nodeProfilingIntegration(),
        ],
        // 1. Tracing
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

        // 2. Profiling (Crucial fix: Profiling requires its own sample rate!)
        profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

        // 3. Environment Tagging
        environment: process.env.NODE_ENV || "development",
    });
};