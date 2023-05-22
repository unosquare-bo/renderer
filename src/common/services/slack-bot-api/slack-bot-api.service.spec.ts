import { Test, TestingModule } from '@nestjs/testing';
import { SlackBotApiService } from './slack-bot-api.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { SlackBotApiImageData, SlackBotApiTokenResponse } from './slack-bot-api.types';

const moduleMocker = new ModuleMocker(global);

describe('SlackBotApiService', () => {
  let service: SlackBotApiService;
  const tokenResponse: SlackBotApiTokenResponse = {
    token: 'fakeToken',
  };
  const imagesData: SlackBotApiImageData[] = [
    { id: 1, fileName: 'cake.png', x: 120, y: 80 },
    { id: 2, fileName: 'balloons.png', x: 10, y: 20 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackBotApiService],
    })
      .useMocker(token => {
        if (token === HttpService) {
          return {
            get: jest.fn(() => of({ data: imagesData })),
            axiosRef: {
              interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
              post: jest.fn().mockResolvedValue({ data: tokenResponse })
            }
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<SlackBotApiService>(SlackBotApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token', async () => {
    expect(await service.refreshToken()).toEqual(tokenResponse);
  });

  it('should get two images data for file names [cake.png, balloons.png]', done => {
    const fileNames = ['cake.png', 'birthday.png'];
    service.getImagesData(fileNames).subscribe(response => {
      expect(response).toEqual(imagesData);
      done();
    });
  });
});
