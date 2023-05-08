import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import SirvCdnTokenResponse from '../../types/SirvCdnTokenResponse';

@Injectable()
export class SirvCdnService {
  constructor(private configService: ConfigService, private readonly httpService: HttpService) { }

  baseUrl = this.configService.get('CDN_API_URL');

  getToken(): Observable<AxiosResponse<SirvCdnTokenResponse>> {
    return this.httpService.post(`${this.baseUrl}/token`, {
      clientId: this.configService.get('CDN_CLIENT_ID'),
      clientSecret: this.configService.get('CDN_CLIENT_SECRET')
    })
  }
}
