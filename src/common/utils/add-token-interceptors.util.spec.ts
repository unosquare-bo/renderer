import { HttpService } from '@nestjs/axios';
import addTokenInterceptors from './add-token-interceptors.util';

describe('addTokenInterceptors', () => {
  const tokenExpected = 'test';
  const fakeUrl = 'test';
  let mockRejectionData = {};

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
    mockRejectionData = {
      config: { method: 'get', url: fakeUrl, _retry: false, headers: {} },
      response: { status: 401 },
    };
    jest
      .spyOn(httpService.axiosRef, 'get')
      .mockImplementation((url, config) => Promise.resolve(config));
  });

  it('should have bearer token in header after rejection', async () => {
    httpService = addTokenInterceptors(httpService, fakeUrl, tokenUtils);
    const { response } = httpService.axiosRef.interceptors;
    const rejected = await (response as any).handlers[0].rejected(mockRejectionData);
    expect(rejected.headers.Authorization).toBe(`Bearer ${tokenExpected}`);
  });

  it('should have bearer token in header after rejection and new request afterwards', async () => {
    httpService = addTokenInterceptors(httpService, fakeUrl, tokenUtils);
    const { request, response } = httpService.axiosRef.interceptors;
    await (response as any).handlers[0].rejected(mockRejectionData);
    const mockFulfilledData = { url: fakeUrl, headers: {} };
    const fulfilled = await (request as any).handlers[0].fulfilled(mockFulfilledData);
    expect(fulfilled.headers.Authorization).toBe(`Bearer ${tokenExpected}`);
  });
});
