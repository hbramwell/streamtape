import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { StreamTapeConfig, RetryConfig } from '../types/config-types';
import { API_CONSTANTS } from '../constants/api-constants';
import {
  ApiRequestError,
  AuthenticationError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ValidationError
} from '../errors/api-errors';

/**
 * HTTP Client for making API requests with retry logic
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  private retryConfig: Required<RetryConfig>;

  constructor(config: StreamTapeConfig) {
    const {
      baseUrl = API_CONSTANTS.BASE_URL,
      timeout = API_CONSTANTS.DEFAULTS.TIMEOUT,
      retry = {}
    } = config;

    this.retryConfig = {
      maxRetries: retry.maxRetries ?? API_CONSTANTS.DEFAULTS.RETRY.MAX_RETRIES,
      baseDelay: retry.baseDelay ?? API_CONSTANTS.DEFAULTS.RETRY.BASE_DELAY,
      maxDelay: retry.maxDelay ?? API_CONSTANTS.DEFAULTS.RETRY.MAX_DELAY,
      retryableStatusCodes: [...(retry.retryableStatusCodes ?? API_CONSTANTS.DEFAULTS.RETRY.RETRYABLE_STATUS_CODES)]
    };

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout,
      params: {
        login: config.login,
        key: config.key
      }
    });

    this.setupInterceptors();
  }

  /**
   * Make an HTTP request with retry logic
   */
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= this.retryConfig.maxRetries) {
      try {
        const response = await this.axiosInstance.request<T>(config);
        return response.data;
      } catch (error) {
        lastError = this.handleError(error);
        
        if (this.shouldRetry(error, attempt)) {
          const delay = this.calculateRetryDelay(attempt);
          await this.sleep(delay);
          attempt++;
          continue;
        }
        
        throw lastError;
      }
    }

    throw lastError ?? new NetworkError();
  }

  /**
   * Setup axios interceptors for response handling
   */
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data?.status && response.data.status !== API_CONSTANTS.HTTP_STATUS.OK) {
          throw new ApiRequestError(
            response.data.msg || 'API request failed',
            response.data.status,
            response.data
          );
        }
        return response;
      },
      (error: unknown) => {
        throw this.handleError(error);
      }
    );
  }

  /**
   * Handle API errors and convert them to custom error types
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case API_CONSTANTS.HTTP_STATUS.BAD_REQUEST:
          return new ValidationError(data?.msg || 'Invalid request parameters');
        case API_CONSTANTS.HTTP_STATUS.FORBIDDEN:
          return new AuthenticationError();
        case API_CONSTANTS.HTTP_STATUS.NOT_FOUND:
          return new NotFoundError();
        case API_CONSTANTS.HTTP_STATUS.BANDWIDTH_EXCEEDED:
          return new RateLimitError();
        default:
          return new ApiRequestError(
            data?.msg || 'API request failed',
            status,
            data
          );
      }
    }

    if (axios.isAxiosError(error) && error.request) {
      return new NetworkError();
    }

    return error instanceof Error ? error : new Error('Unknown error occurred');
  }

  /**
   * Determine if a request should be retried
   */
  private shouldRetry(error: unknown, attempt: number): boolean {
    if (attempt >= this.retryConfig.maxRetries) {
      return false;
    }

    if (axios.isAxiosError(error) && error.response?.status) {
      return this.retryConfig.retryableStatusCodes.includes(error.response.status);
    }

    return false;
  }

  /**
   * Calculate delay for next retry attempt using exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.baseDelay * Math.pow(2, attempt),
      this.retryConfig.maxDelay
    );
    return delay + Math.random() * 100; // Add jitter
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 