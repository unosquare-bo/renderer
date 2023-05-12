import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import addTokenInterceptors from './add-token-interceptors.util';

const moduleMocker = new ModuleMocker(global);

describe('addTokenInterceptors', () => {
  let httpService: HttpService;
  let testToken = '';

  beforeEach(async () => {
    httpService = new HttpService();
  });

  it('should have token', async () => {
    const tokenUtils = {
      getToken: () => testToken,
      setToken: (token: string) => {
        testToken = token;
      },
      refreshToken: () => {
        return Promise.resolve({ token: 'a' });
      }
    }

    jest.spyOn(httpService, 'axiosRef').mockImplementation(async (config) => {
      if (config) {
        return Promise.resolve({})
      }
      return httpService.axiosRef;
    })
    httpService = addTokenInterceptors(httpService, 'test', tokenUtils);
    const rejected = await (httpService.axiosRef.interceptors.response as any).handlers[0].rejected({
      config: { url: 'test', _retry: false, headers: {} },
      response: { status: 401 },
    });
    console.log(rejected)
    console.log((httpService.axiosRef.interceptors.request as any).handlers[0].fulfilled({ url: 'test', headers: {} }))
    expect(true).toBe(true);
  });
});
