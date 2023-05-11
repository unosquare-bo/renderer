import { Test, TestingModule } from '@nestjs/testing';
import { SirvCdnService } from './sirv-cdn.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

const moduleMocker = new ModuleMocker(global);

describe('SirvCdnService', () => {
  let service: SirvCdnService;
  const tokenResponse = {
    token: 'fakeToken',
    expiresIn: 1000,
  };
  const topicImages = [
    { filename: 'cake.png', meta: { x: 120, y: 80 } },
    { filename: 'balloons.png', meta: { x: 120, y: 80 } },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SirvCdnService],
    })
      .useMocker(token => {
        if (token === HttpService) {
          return {
            get: jest.fn(() => of({ data: { contents: topicImages } })),
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

    service = module.get<SirvCdnService>(SirvCdnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token', async () => {
    expect(await service.refreshToken()).toEqual(tokenResponse);
  });

  it('should get two images (cake and balloons) for topic birthday', done => {
    const topic = 'birthday';
    service.getTopicImages(topic).subscribe(response => {
      expect(response).toEqual(topicImages);
      done();
    });
  });
});
