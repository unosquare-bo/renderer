import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SirvCdnTokenResponse from '../../types/SirvCdnTokenResponse';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';

interface FolderContentsCdnResponse {
  contents: FileDataCdn
}
interface FileDataCdn {
  filename: string;
  meta: FileMetaData;
}

interface FileMetaData {
  width: number;
  height: number;
}

@Injectable()
export class SirvCdnService {
  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    httpService.axiosRef.interceptors.response.use(config => {
      console.log('getTokenCdn', this.token);
      return {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${this.token}` }
      }
    });
    httpService.axiosRef.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        console.log('errorcdn');
        const originalConfig = error.config;
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          const { token } = await this.refreshToken();
          this.token = token;
          console.log('setTokenCdn', this.token);
          originalConfig.headers.Authorization = `Bearer ${token}`;
          return httpService.axiosRef(originalConfig);
        }
      });
  }

  baseUrl = this.configService.get('CDN_API_URL');
  token = '';

  async refreshToken(): Promise<SirvCdnTokenResponse> {
    return this.httpService.axiosRef.post(`${this.baseUrl}/token`, {
      clientId: this.configService.get('CDN_CLIENT_ID'),
      clientSecret: this.configService.get('CDN_CLIENT_SECRET')
    })
      .then(response => response.data);
  }

  getTopicImages(topic: string): Observable<AxiosResponse<FileDataCdn[]>> {
    return this.httpService.get(`${this.baseUrl}/files/readdir?dirname=/Images/topics/${topic}`)
      .pipe(map(({ data }) => data.contents));
  }
}
