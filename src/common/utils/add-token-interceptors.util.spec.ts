import { HttpService } from '@nestjs/axios';
import addTokenInterceptors from './add-token-interceptors.util';

describe('addTokenInterceptors', () => {
  const tokenExpected = 'test';
  const fakeUrl = 'test';

  let httpService: HttpService;
  let testToken = '';
  const tokenUtils = {
    getToken: () => testToken,
    setToken: (token: string) => {
      testToken = token;
    },
    refreshToken: () => {
      return Promise.resolve({ token: tokenExpected });
    }
  }

  beforeEach(async () => {
    httpService = new HttpService();
    testToken = '';
    jest.spyOn(httpService.axiosRef, 'post').mockImplementation((config) => {
      return Promise.resolve(config)
    });
  });

  it('should have bearer token in header after rejection', async () => {
    httpService = addTokenInterceptors(httpService, fakeUrl, tokenUtils);
    const rejected = await (httpService.axiosRef.interceptors.response as any).handlers[0].rejected({
      config: { url: fakeUrl, _retry: false, headers: {} },
      response: { status: 401 },
    });
    expect(rejected.headers.Authorization).toBe(`Bearer ${tokenExpected}`);
  });

  it('should have bearer token in header after rejection and new request afterwards', async () => {
    httpService = addTokenInterceptors(httpService, fakeUrl, tokenUtils);
    await (httpService.axiosRef.interceptors.response as any).handlers[0].rejected({
      config: { url: fakeUrl, _retry: false, headers: {} },
      response: { status: 401 },
    });
    const fulfilled = await (httpService.axiosRef.interceptors.request as any).handlers[0].fulfilled({ url: 'test', headers: {} })
    expect(fulfilled.headers.Authorization).toBe(`Bearer ${tokenExpected}`);
  });
});
