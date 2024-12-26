
import LoggerService from './services/LoggerService';

// ...existing code...

catch (error) {
    LoggerService.error('Erro ao atualizar áreas', { error, data });
}

// ...existing code...