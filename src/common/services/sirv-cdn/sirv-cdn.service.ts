import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SirvCdnTokenResponse from '../../types/SirvCdnTokenResponse';
import { Observable, map, tap } from 'rxjs';
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
  constructor(private configService: ConfigService) {
    this.httpService = new HttpService();
    this.httpService.axiosRef.interceptors.request.use(config => {
      if (config.url.includes(this.configService.get('CDN_API_URL'))) {
        console.log('cdn request');
        return {
          ...config,
          headers: { ...config.headers, Authorization: `Bearer ${this.token}` }
        }
      }
      return config;
    });
    this.httpService.axiosRef.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const originalConfig = error.config;
        if (originalConfig.url.includes(this.configService.get('CDN_API_URL'))) {
          console.log('cdn fail 1');
          if (error.response.status === 401 && !originalConfig._retry) {
            console.log('cdn fail 2');
            originalConfig._retry = true;
            const { token } = await this.refreshToken();
            this.token = token;
            console.log('setTokenCdn', this.token);
            originalConfig.headers.Authorization = `Bearer ${token}`;
            return this.httpService.axiosRef(originalConfig);
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      });
  }

  baseUrl = this.configService.get('CDN_API_URL');
  token = '';
  httpService = null;

  async refreshToken(): Promise<SirvCdnTokenResponse> {
    return this.httpService.axiosRef.post(`${this.baseUrl}/token`, {
      clientId: this.configService.get('CDN_CLIENT_ID'),
      clientSecret: this.configService.get('CDN_CLIENT_SECRET')
    })
      .then(response => response.data);
  }

  getTopicImages(topic: string): Observable<FileDataCdn[]> {
    return this.httpService.get(`${this.baseUrl}/files/readdir?dirname=/Images/topics/${topic}`)
      .pipe(
        map(({ data }) => data.contents));
  }
}
