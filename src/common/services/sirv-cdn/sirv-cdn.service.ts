import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SirvCdnTokenResponse, SirvCdnFileData } from './sirv-cdn.types'
import { Observable, map } from 'rxjs';
import addTokenInterceptors from '../../utils/add-token-interceptors.util';

@Injectable()
export class SirvCdnService {
  constructor(private configService: ConfigService, private httpService: HttpService) {
    const tokenUtils = {
      getToken: () => this.token,
      setToken: (token: string) => {
        this.token = token;
      },
      refreshToken: this.refreshToken.bind(this)
    }
    this.httpService = addTokenInterceptors(httpService, this.configService.get('CDN_API_URL'), tokenUtils);
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

  getTopicImages(topic: string): Observable<SirvCdnFileData[]> {
    return this.httpService.get(`${this.baseUrl}/files/readdir?dirname=/Images/topics/${topic}`)
      .pipe(map(({ data }) => data.contents));
  }
}
