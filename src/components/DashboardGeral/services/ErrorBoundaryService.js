import LoggerService from './LoggerService';
import StateManager from './StateManager';

class ErrorBoundaryService {
  private errorStack = [];
  private maxErrors = 50;
  private recoveryStrategies = new Map();

  captureError(error, componentStack) {
    const errorInfo = {
      id: crypto.randomUUID(),
      error: error.message,
      stack: error.stack,
      componentStack,
      timestamp: new Date(),
      recovered: false
    };

    this.errorStack.unshift(errorInfo);
    this.errorStack = this.errorStack.slice(0, this.maxErrors);

    LoggerService.log('error', 'Component error captured', errorInfo);
    this.attemptRecovery(errorInfo);
    this.updateState();
  }

  registerRecoveryStrategy(errorType, strategy) {
    this.recoveryStrategies.set(errorType, strategy);
  }

  private attemptRecovery(errorInfo) {
    const strategy = this.findRecoveryStrategy(errorInfo.error);
    if (strategy) {
      try {
        strategy(errorInfo);
        errorInfo.recovered = true;
        LoggerService.log('info', 'Error recovered', errorInfo);
      } catch (recoveryError) {
        LoggerService.log('error', 'Recovery failed', { 
          originalError: errorInfo,
          recoveryError 
        });
      }
    }
  }

  private findRecoveryStrategy(errorMessage) {
    for (const [errorType, strategy] of this.recoveryStrategies) {
      if (errorMessage.includes(errorType)) {
        return strategy;
      }
    }
    return null;
  }

  private updateState() {
    StateManager.setState({
      errors: {
        list: this.errorStack,
        lastError: this.errorStack[0],
        hasUnrecovered: this.errorStack.some(e => !e.recovered)
      }
    });
  }

  getErrors() {
    return this.errorStack;
  }

  clearErrors() {
    this.errorStack = [];
    this.updateState();
  }
}

export default new ErrorBoundaryService();