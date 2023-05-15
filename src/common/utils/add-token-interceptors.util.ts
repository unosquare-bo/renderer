import { HttpService } from "@nestjs/axios";
import TokenUtils from "../types/TokenUtils";

export default function addTokenInterceptors(httpService: HttpService, urlToValidate: string, tokenUtils: TokenUtils): HttpService {
  httpService.axiosRef.interceptors.request.use(config => {
    if (config.url.includes(urlToValidate)) {
      config.headers.Authorization = `Bearer ${tokenUtils.getToken()}`;
    }
    return config;
  });
  httpService.axiosRef.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalConfig = error.config;
      if (
        originalConfig.url.includes(urlToValidate) &&
        error.response.status === 401 &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;
        const { token } = await tokenUtils.refreshToken();
        tokenUtils.setToken(token);
        originalConfig.headers.Authorization = `Bearer ${token}`;
        return httpService.axiosRef.post(originalConfig);
      }
      return Promise.reject(error);
    });
  return httpService;
}
