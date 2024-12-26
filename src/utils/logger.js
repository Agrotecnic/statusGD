export const logger = {
    info: (message, ...args) => {
        console.info(`[${new Date().toISOString()}]`, message, ...args);
    },
    error: (message, ...args) => {
        console.error(`[${new Date().toISOString()}]`, message, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[${new Date().toISOString()}]`, message, ...args);
    },
    debug: (message, ...args) => {
        console.debug(`[${new Date().toISOString()}]`, message, ...args);
    }
};
