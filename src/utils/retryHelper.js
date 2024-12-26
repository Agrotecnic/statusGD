import { logger } from './logger';

export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            logger.warn(`Tentativa ${i + 1} falhou: ${error.message}`);
            
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
    
    throw lastError;
};
