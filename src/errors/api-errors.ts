/**
 * Base class for StreamTape API errors
 */
export class StreamTapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StreamTapeError';
  }
}

/**
 * Error thrown when API authentication fails
 */
export class AuthenticationError extends StreamTapeError {
  constructor(message = 'Authentication failed. Please check your login and key.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when API request validation fails
 */
export class ValidationError extends StreamTapeError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when API rate limit is exceeded
 */
export class RateLimitError extends StreamTapeError {
  constructor(message = 'Rate limit exceeded. Please try again later.') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends StreamTapeError {
  constructor(message = 'The requested resource was not found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when API request fails
 */
export class ApiRequestError extends StreamTapeError {
  public status: number;
  public response: unknown;

  constructor(message: string, status: number, response?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.response = response ?? null;
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends StreamTapeError {
  constructor(message = 'Network request failed. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
} 