import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { SlackBotApiTokenResponse, SlackBotApiImageData } from './slack-bot-api.types';

@Injectable()
export class SlackBotApiService {
  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(config => {
      if (config.url.includes(this.configService.get('SLACKBOT_API_URL'))) {
        config.headers.Authorization = `Bearer ${this.token}`
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
        if (
          originalConfig.url.includes(this.configService.get('SLACKBOT_API_URL')) &&
          error.response.status === 401 &&
          !originalConfig._retry
        ) {
          originalConfig._retry = true;
          const { token } = await this.refreshToken();
          this.token = token;
          originalConfig.headers.Authorization = `Bearer ${token}`;
          return this.httpService.axiosRef(originalConfig);
        }
        return Promise.reject(error);
      });
  }

  baseUrl = this.configService.get('SLACKBOT_API_URL');
  token = '';

  async refreshToken(): Promise<SlackBotApiTokenResponse> {
    return this.httpService.axiosRef.post(`${this.baseUrl}/auth/signin`, {
      email: this.configService.get('SLACKBOT_API_EMAIL'),
      password: this.configService.get('SLACKBOT_API_PASSWORD')
    })
      .then(response => response.data);
  }

  getImagesData(fileNames: string[]): Observable<SlackBotApiImageData[]> {
    const fileNamesString = fileNames.join(',');
    return this.httpService.get(`${this.baseUrl}/image/names/${fileNamesString}`)
      .pipe(map(({ data }) => data));
  }
}