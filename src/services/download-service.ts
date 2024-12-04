import { HttpClient } from '../utils/http-client';
import { API_CONSTANTS } from '../constants/api-constants';
import { ApiResponse, DownloadTicket, DownloadLink } from '../types/api-types';

/**
 * Service for handling download-related operations
 */
export class DownloadService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get a download ticket for a file
   * @param fileId File ID to download
   * @returns Promise<DownloadTicket>
   */
  public async getDownloadTicket(fileId: string): Promise<DownloadTicket> {
    const response = await this.httpClient.request<ApiResponse<DownloadTicket>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_DL_TICKET,
      params: { file: fileId }
    });

    return response.result;
  }

  /**
   * Get a download link using a download ticket
   * @param fileId File ID to download
   * @param ticket Download ticket obtained from getDownloadTicket
   * @param captchaResponse Optional captcha response if required
   * @returns Promise<DownloadLink>
   */
  public async getDownloadLink(
    fileId: string,
    ticket: string,
    captchaResponse?: string
  ): Promise<DownloadLink> {
    const response = await this.httpClient.request<ApiResponse<DownloadLink>>({
      method: 'GET',
      url: API_CONSTANTS.ENDPOINTS.FILE_DL,
      params: {
        file: fileId,
        ticket,
        ...(captchaResponse && { captcha_response: captchaResponse })
      }
    });

    return response.result;
  }

  /**
   * Convenience method to get a download link in one step
   * @param fileId File ID to download
   * @param captchaResponse Optional captcha response if required
   * @returns Promise<DownloadLink>
   */
  public async getDirectDownloadLink(
    fileId: string,
    captchaResponse?: string
  ): Promise<DownloadLink> {
    const ticket = await this.getDownloadTicket(fileId);
    
    // Wait for the ticket to become valid if necessary
    if (ticket.wait_time > 0) {
      await new Promise(resolve => setTimeout(resolve, ticket.wait_time * 1000));
    }

    return this.getDownloadLink(fileId, ticket.ticket, captchaResponse);
  }
} 