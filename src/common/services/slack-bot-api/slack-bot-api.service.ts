import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { SlackBotApiTokenResponse, SlackBotApiImageData } from './slack-bot-api.types';
import addTokenInterceptors from '../../utils/add-token-interceptors.util';

@Injectable()
export class SlackBotApiService {
  constructor(private configService: ConfigService, private httpService: HttpService) {
    const tokenUtils = {
      getToken: () => this.token,
      setToken: (token: string) => {
        this.token = token;
      },
      refreshToken: this.refreshToken.bind(this)
    }
    this.httpService = addTokenInterceptors(httpService, this.configService.get('SLACKBOT_API_URL'), tokenUtils);
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
