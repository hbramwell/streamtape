import { HttpClient } from '../utils/http-client';
import { API_CONSTANTS } from '../constants/api-constants';
import { ApiResponse, UploadUrlResponse, RemoteUploadResponse, RemoteUploadStatus } from '../types/api-types';
import axios, { AxiosProgressEvent } from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { ValidationError } from '../errors/api-errors';

/**
 * Service for handling upload-related operations
 */
export class UploadService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get an upload URL for direct file upload
   * @param options Upload options
   * @returns Promise<UploadUrlResponse>
   */
  public async getUploadUrl(options: {
    folderId?: string;
    sha256?: string;
    httpOnly?: boolean;
  } = {}): Promise<UploadUrlResponse> {
    const response = await this.httpClient.request<ApiResponse<UploadUrlResponse>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_UPLOAD,
      params: {
        ...(options.folderId && { folder: options.folderId }),
        ...(options.sha256 && { sha256: options.sha256 }),
        ...(options.httpOnly && { httponly: true })
      }
    });

    return response.result;
  }

  /**
   * Upload a file using a local file path
   * @param filePath Local path to the file
   * @param options Upload options
   * @returns Promise<string> File ID of the uploaded file
   */
  public async uploadFile(
    filePath: string,
    options: {
      folderId?: string;
      sha256?: string;
      httpOnly?: boolean;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<string> {
    const uploadUrl = await this.getUploadUrl(options);

    const form = new FormData();
    form.append('file1', createReadStream(filePath));

    const response = await axios.post(uploadUrl.url, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      onUploadProgress: options.onProgress
        ? (progressEvent: AxiosProgressEvent): void => {
            if (progressEvent.total) {
              const progress = progressEvent.loaded / progressEvent.total;
              options.onProgress?.(progress);
            }
          }
        : undefined
    });

    if (response.status !== 200 || !response.data?.result?.url) {
      throw new ValidationError('Upload failed: Invalid response from server');
    }

    // Extract file ID from the response URL
    const match = response.data.result.url.match(/\/v\/([^/]+)/);
    if (!match) {
      throw new ValidationError('Upload failed: Could not extract file ID from response');
    }

    return match[1];
  }

  /**
   * Add a remote upload
   * @param url URL to upload from
   * @param options Upload options
   * @returns Promise<RemoteUploadResponse>
   */
  public async addRemoteUpload(
    url: string,
    options: {
      folderId?: string;
      headers?: string;
      name?: string;
    } = {}
  ): Promise<RemoteUploadResponse> {
    const response = await this.httpClient.request<ApiResponse<RemoteUploadResponse>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.REMOTE_UPLOAD_ADD,
      params: {
        url,
        ...(options.folderId && { folder: options.folderId }),
        ...(options.headers && { headers: options.headers }),
        ...(options.name && { name: options.name })
      }
    });

    return response.result;
  }

  /**
   * Remove a remote upload
   * @param uploadId Remote upload ID or 'all' to remove all
   * @returns Promise<boolean>
   */
  public async removeRemoteUpload(uploadId: string | 'all'): Promise<boolean> {
    const response = await this.httpClient.request<ApiResponse<boolean>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.REMOTE_UPLOAD_REMOVE,
      params: { id: uploadId }
    });

    return response.result;
  }

  /**
   * Check status of remote uploads
   * @param uploadId Remote upload ID
   * @returns Promise<Record<string, RemoteUploadStatus>>
   */
  public async checkRemoteUploadStatus(
    uploadId: string
  ): Promise<Record<string, RemoteUploadStatus>> {
    const response = await this.httpClient.request<ApiResponse<Record<string, RemoteUploadStatus>>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.REMOTE_UPLOAD_STATUS,
      params: { id: uploadId }
    });

    return response.result;
  }

  /**
   * Wait for a remote upload to complete
   * @param uploadId Remote upload ID
   * @param options Polling options
   * @returns Promise<RemoteUploadStatus>
   */
  public async waitForRemoteUpload(
    uploadId: string,
    options: {
      pollInterval?: number;
      timeout?: number;
      onProgress?: (status: RemoteUploadStatus) => void;
    } = {}
  ): Promise<RemoteUploadStatus> {
    const {
      pollInterval = 5000,
      timeout = 3600000, // 1 hour default timeout
      onProgress
    } = options;

    const startTime = Date.now();
    let uploadStatus: RemoteUploadStatus | undefined;

    for (;;) {
      const status = await this.checkRemoteUploadStatus(uploadId);
      uploadStatus = status[uploadId];

      if (!uploadStatus) {
        throw new ValidationError('Remote upload not found');
      }

      onProgress?.(uploadStatus);

      if (uploadStatus.url || uploadStatus.status === 'error') {
        return uploadStatus;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for remote upload to complete');
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
} 