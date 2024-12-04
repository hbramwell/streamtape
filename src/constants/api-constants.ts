/**
 * API Constants
 */
export const API_CONSTANTS = {
  /**
   * Default API base URL
   */
  BASE_URL: 'https://api.streamtape.com',

  /**
   * API Endpoints
   */
  ENDPOINTS: {
    // Account
    ACCOUNT_INFO: '/account/info',

    // File operations
    FILE_INFO: '/file/info',
    FILE_LIST_FOLDER: '/file/listfolder',
    FILE_CREATE_FOLDER: '/file/createfolder',
    FILE_RENAME_FOLDER: '/file/renamefolder',
    FILE_DELETE_FOLDER: '/file/deletefolder',
    FILE_RENAME: '/file/rename',
    FILE_MOVE: '/file/move',
    FILE_DELETE: '/file/delete',
    FILE_RUNNING_CONVERTS: '/file/runningconverts',
    FILE_FAILED_CONVERTS: '/file/failedconverts',
    FILE_GET_SPLASH: '/file/getsplash',

    // Download operations
    FILE_DL_TICKET: '/file/dlticket',
    FILE_DL: '/file/dl',

    // Upload operations
    FILE_UPLOAD: '/file/ul',
    REMOTE_UPLOAD_ADD: '/remotedl/add',
    REMOTE_UPLOAD_REMOVE: '/remotedl/remove',
    REMOTE_UPLOAD_STATUS: '/remotedl/status'
  },

  /**
   * Default configuration
   */
  DEFAULTS: {
    TIMEOUT: 30000,
    RETRY: {
      MAX_RETRIES: 3,
      BASE_DELAY: 1000,
      MAX_DELAY: 5000,
      RETRYABLE_STATUS_CODES: [429, 503]
    }
  },

  /**
   * HTTP Status Codes
   */
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    LEGAL_REASONS: 451,
    BANDWIDTH_EXCEEDED: 509
  }
} as const; 