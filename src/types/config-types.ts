/**
 * StreamTape API configuration options
 */
export interface StreamTapeConfig {
  /**
   * API login credential
   */
  login: string;

  /**
   * API key credential
   */
  key: string;

  /**
   * Base URL for the API (optional, defaults to https://api.streamtape.com)
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds (optional, defaults to 30000)
   */
  timeout?: number;

  /**
   * Retry configuration (optional)
   */
  retry?: RetryConfig;
}

/**
 * Retry configuration options
 */
export interface RetryConfig {
  /**
   * Maximum number of retry attempts (defaults to 3)
   */
  maxRetries?: number;

  /**
   * Base delay between retries in milliseconds (defaults to 1000)
   */
  baseDelay?: number;

  /**
   * Maximum delay between retries in milliseconds (defaults to 5000)
   */
  maxDelay?: number;

  /**
   * HTTP status codes that should trigger a retry (defaults to [429, 503])
   */
  retryableStatusCodes?: number[];
} 