import { StreamTapeConfig } from './src/types/config-types';
import { HttpClient } from './src/utils/http-client';
import { AccountService } from './src/services/account-service';
import { FileService } from './src/services/file-service';
import { DownloadService } from './src/services/download-service';
import { UploadService } from './src/services/upload-service';

/**
 * StreamTape API Client
 * A production-grade TypeScript wrapper for the StreamTape API
 */
export class StreamTape {
  private readonly httpClient: HttpClient;
  
  /**
   * Account-related operations
   */
  public readonly account: AccountService;

  /**
   * File-related operations
   */
  public readonly file: FileService;

  /**
   * Download-related operations
   */
  public readonly download: DownloadService;

  /**
   * Upload-related operations
   */
  public readonly upload: UploadService;

  /**
   * Create a new StreamTape API client
   * @param config Client configuration
   */
  constructor(config: StreamTapeConfig) {
    this.httpClient = new HttpClient(config);
    
    this.account = new AccountService(this.httpClient);
    this.file = new FileService(this.httpClient);
    this.download = new DownloadService(this.httpClient);
    this.upload = new UploadService(this.httpClient);
  }
}

// Export types
export * from './src/types/api-types';
export * from './src/types/config-types';
export * from './src/errors/api-errors';