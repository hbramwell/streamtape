import { HttpClient } from '../utils/http-client';
import { API_CONSTANTS } from '../constants/api-constants';
import {
  ApiResponse,
  FileInfo,
  FolderContent,
  ConvertStatus,
  ThumbnailResponse
} from '../types/api-types';

/**
 * Service for handling file-related operations
 */
export class FileService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get information about one or multiple files
   * @param fileIds Single file ID or array of file IDs (max 100)
   * @returns Promise<Record<string, FileInfo>>
   */
  public async getFileInfo(fileIds: string | string[]): Promise<Record<string, FileInfo>> {
    const files = Array.isArray(fileIds) ? fileIds.join(',') : fileIds;
    
    const response = await this.httpClient.request<ApiResponse<Record<string, FileInfo>>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_INFO,
      params: { file: files }
    });

    return response.result;
  }

  /**
   * List contents of a folder
   * @param folderId Optional folder ID (root folder if not specified)
   * @returns Promise<FolderContent>
   */
  public async listFolder(folderId?: string): Promise<FolderContent> {
    const response = await this.httpClient.request<ApiResponse<FolderContent>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_LIST_FOLDER,
      params: folderId ? { folder: folderId } : undefined
    });

    return response.result;
  }

  /**
   * Create a new folder
   * @param name Folder name
   * @param parentId Optional parent folder ID
   * @returns Promise<string> New folder ID
   */
  public async createFolder(name: string, parentId?: string): Promise<string> {
    const response = await this.httpClient.request<ApiResponse<{ folderid: string }>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_CREATE_FOLDER,
      params: {
        name,
        ...(parentId && { pid: parentId })
      }
    });

    return response.result.folderid;
  }

  /**
   * Rename a folder
   * @param folderId Folder ID to rename
   * @param newName New folder name
   * @returns Promise<boolean>
   */
  public async renameFolder(folderId: string, newName: string): Promise<boolean> {
    const response = await this.httpClient.request<ApiResponse<boolean>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_RENAME_FOLDER,
      params: {
        folder: folderId,
        name: newName
      }
    });

    return response.result;
  }

  /**
   * Delete a folder and all its contents
   * @param folderId Folder ID to delete
   * @returns Promise<boolean>
   */
  public async deleteFolder(folderId: string): Promise<boolean> {
    const response = await this.httpClient.request<ApiResponse<boolean>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_DELETE_FOLDER,
      params: { folder: folderId }
    });

    return response.result;
  }

  /**
   * Rename a file
   * @param fileId File ID to rename
   * @param newName New file name
   * @returns Promise<boolean>
   */
  public async renameFile(fileId: string, newName: string): Promise<boolean> {
    const response = await this.httpClient.request<ApiResponse<boolean>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_RENAME,
      params: {
        file: fileId,
        name: newName
      }
    });

    return response.result;
  }

  /**
   * Move a file to a different folder
   * @param fileId File ID to move
   * @param targetFolderId Target folder ID
   * @returns Promise<boolean>
   */
  public async moveFile(fileId: string, targetFolderId: string): Promise<boolean> {
    const response = await this.httpClient.request<ApiResponse<boolean>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_MOVE,
      params: {
        file: fileId,
        folder: targetFolderId
      }
    });

    return response.result;
  }

  /**
   * Delete a file
   * @param fileId File ID to delete
   * @returns Promise<boolean>
   */
  public async deleteFile(fileId: string): Promise<boolean> {
    const response = await this.httpClient.request<ApiResponse<boolean>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_DELETE,
      params: { file: fileId }
    });

    return response.result;
  }

  /**
   * Get list of running converts
   * @returns Promise<ConvertStatus[]>
   */
  public async getRunningConverts(): Promise<ConvertStatus[]> {
    const response = await this.httpClient.request<ApiResponse<ConvertStatus[]>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_RUNNING_CONVERTS
    });

    return response.result;
  }

  /**
   * Get list of failed converts
   * @returns Promise<ConvertStatus[]>
   */
  public async getFailedConverts(): Promise<ConvertStatus[]> {
    const response = await this.httpClient.request<ApiResponse<ConvertStatus[]>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_FAILED_CONVERTS
    });

    return response.result;
  }

  /**
   * Get thumbnail URL for a file
   * @param fileId File ID
   * @returns Promise<string> Thumbnail URL
   */
  public async getThumbnail(fileId: string): Promise<string> {
    const response = await this.httpClient.request<ApiResponse<ThumbnailResponse>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_GET_SPLASH,
      params: { file: fileId }
    });

    return response.result.url;
  }
} 