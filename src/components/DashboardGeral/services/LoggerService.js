class LoggerService {
    static log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        console[level](`[${timestamp}] ${message}`, data);
    }

    static error(message, data = {}) {
        this.log('error', message, data);
    }

    static info(message, data = {}) {
        this.log('info', message, data);
    }

    static warn(message, data = {}) {
        this.log('warn', message, data);
    }
}

export default LoggerService;