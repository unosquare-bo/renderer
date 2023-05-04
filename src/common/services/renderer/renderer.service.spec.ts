import { Test, TestingModule } from '@nestjs/testing';
import { RendererService } from './renderer.service';

describe('TweetsService', () => {
  let service: RendererService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RendererService],
    }).compile();

    service = module.get<RendererService>(RendererService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Happy Birthday if topic is birthday', () => {
    const title = service.getTitle('birthday');
    expect(title).toBe('Happy Birthday!');
  });

  it('should return Congratulations if topic is not birthday/promotion', () => {
    const title = service.getTitle('something');
    expect(title).toBe('Congratulations!');
  });
});