import CircuitBreaker from 'opossum';
import { logger } from '../config/logger';

interface CircuitBreakerOptions {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  name?: string;
}

export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: CircuitBreakerOptions = {}
): CircuitBreaker {
  const breakerOptions = {
    timeout: options.timeout || 3000,
    errorThresholdPercentage: options.errorThresholdPercentage || 50,
    resetTimeout: options.resetTimeout || 30000,
    name: options.name || 'CircuitBreaker',
  };

  const breaker = new CircuitBreaker(fn, breakerOptions);

  breaker.on('open', () => {
    logger.warn(`Circuit breaker "${breakerOptions.name}" opened - service unavailable`);
  });

  breaker.on('halfOpen', () => {
    logger.info(`Circuit breaker "${breakerOptions.name}" half-open - testing service`);
  });

  breaker.on('close', () => {
    logger.info(`Circuit breaker "${breakerOptions.name}" closed - service restored`);
  });

  breaker.on('failure', (error: Error) => {
    logger.error(`Circuit breaker "${breakerOptions.name}" failure:`, error);
  });

  return breaker;
}
