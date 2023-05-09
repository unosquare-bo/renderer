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
  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    this.h1 = httpService;
    this.h1.axiosRef.interceptors.response.use(config => {
      console.log('getTokenSlack', this.token);
      return {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${this.token}` }
      }
    });
    this.h1.axiosRef.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        console.log('errorslack');
        const originalConfig = error.config;
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          const { token } = await this.refreshToken();
          this.token = token;
          console.log('setTokenSlack', this.token);
          originalConfig.headers.Authorization = `Bearer ${token}`;
          return this.h1.axiosRef(originalConfig);
        }
      });
  }

  baseUrl = this.configService.get('SLACKBOT_API_URL');
  token = '';
  h1 = null;

  async refreshToken(): Promise<{ token: string }> {
    return this.h1.axiosRef.post(`${this.baseUrl}/auth/signin`, {
      email: 'test@test.com',
      password: 'password'
    })
      .then(response => response.data);
  }

  getImagesData(fileNames: string[]): Observable<AxiosResponse<ImageDataAPI[]>> {
    const fileNamesString = fileNames.join(',');
    return this.h1.get(`${this.baseUrl}/image/names/${fileNamesString}`)
  }
}
