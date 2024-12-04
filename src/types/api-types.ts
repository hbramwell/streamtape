/**
 * Base API response structure
 */
export interface ApiResponse<T> {
  status: number;
  msg: string;
  result: T;
}

/**
 * Account information response
 */
export interface AccountInfo {
  apiid: string;
  email: string;
  signup_at: string;
}

/**
 * Download ticket response
 */
export interface DownloadTicket {
  ticket: string;
  wait_time: number;
  valid_until: string;
}

/**
 * Download link response
 */
export interface DownloadLink {
  name: string;
  size: number;
  url: string;
}

/**
 * File information
 */
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  converted: boolean;
  status: number;
}

/**
 * Upload URL response
 */
export interface UploadUrlResponse {
  url: string;
  valid_until: string;
}

/**
 * Remote upload response
 */
export interface RemoteUploadResponse {
  id: string;
  folderid: string;
}

/**
 * Remote upload status
 */
export interface RemoteUploadStatus {
  id: string;
  remoteurl: string;
  status: string;
  bytes_loaded: number | null;
  bytes_total: number | null;
  folderid: string;
  added: string;
  last_update: string;
  extid: boolean | string;
  url: boolean | string;
}

/**
 * Folder content
 */
export interface FolderContent {
  folders: Array<{
    id: string;
    name: string;
  }>;
  files: Array<{
    name: string;
    size: number;
    link: string;
    created_at: number;
    downloads: number;
    linkid: string;
    convert: string;
  }>;
}

/**
 * Convert status
 */
export interface ConvertStatus {
  name: string;
  folderid: string;
  status: string;
  progress: number;
  retries: number;
  link: string;
  linkid: string;
}

/**
 * Thumbnail response
 */
export interface ThumbnailResponse {
  url: string;
} 