import { HttpClient } from '../utils/http-client';
import { API_CONSTANTS } from '../constants/api-constants';
import { ApiResponse, AccountInfo } from '../types/api-types';

/**
 * Service for handling account-related operations
 */
export class AccountService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get account information
   * @returns Promise<AccountInfo>
   * @throws {ApiRequestError} If the API request fails
   * @throws {AuthenticationError} If authentication fails
   */
  public async getAccountInfo(): Promise<AccountInfo> {
    const response = await this.httpClient.request<ApiResponse<AccountInfo>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.ACCOUNT_INFO
    });

    return response.result;
  }
} 