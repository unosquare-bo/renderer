import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';

interface ImageDataAPI {
  id: number;
  fileName: string;
  x: number;
  y: number;
}

@Injectable()
export class SlackBotApiService {
  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(config => {
      if (config.url.includes(this.configService.get('SLACKBOT_API_URL'))) {
        return {
          ...config,
          headers: { ...config.headers, Authorization: `Bearer ${this.token}` }
        } as InternalAxiosRequestConfig;
      }
      return config;
    }
    );
    this.httpService.axiosRef.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const originalConfig = error.config;
        if (originalConfig.url.includes(this.configService.get('SLACKBOT_API_URL'))) {
          if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            const { token } = await this.refreshToken();
            this.token = token;
            originalConfig.headers.Authorization = `Bearer ${token}`;
            return this.httpService.axiosRef(originalConfig);
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      });
  }

  baseUrl = this.configService.get('SLACKBOT_API_URL');
  token = '';

  async refreshToken(): Promise<{ token: string }> {
    return this.httpService.axiosRef.post(`${this.baseUrl}/auth/signin`, {
      email: 'test@test.com',
      password: 'password'
    })
      .then(response => response.data);
  }

  getImagesData(fileNames: string[]): Observable<AxiosResponse<ImageDataAPI[]>> {
    const fileNamesString = fileNames.join(',');
    return this.httpService.get(`${this.baseUrl}/image/names/${fileNamesString}`)
  }
}
