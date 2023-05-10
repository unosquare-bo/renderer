import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

interface ImageDataAPI {
  id: number;
  fileName: string;
  x: number;
  y: number;
}

@Injectable()
export class SlackBotApiService {
  constructor(private configService: ConfigService) {
    this.httpService = new HttpService();
    this.httpService.axiosRef.interceptors.request.use(config => {
      if (config.url.includes(this.configService.get('SLACKBOT_API_URL'))) {
        console.log('slack request');
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
        if (originalConfig.url.includes(this.configService.get('SLACKBOT_API_URL'))) {
          console.log('slack fail 1');
          if (error.response.status === 401 && !originalConfig._retry) {
            console.log('slack fail 2');
            originalConfig._retry = true;
            const { token } = await this.refreshToken();
            this.token = token;
            console.log('setTokenSlack', this.token);
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
  httpService = null;

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
