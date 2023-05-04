import { Test, TestingModule } from '@nestjs/testing';
import { RendererService } from './renderer.service';
import { BadRequestException } from '@nestjs/common';

describe('RendererService', () => {
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

  it('should throw exception if subtitle exceeds characters', async () => {
    const longText = 'Test test test test test test test test test test test test test test test test test test test test Test test test test test test test test test test test test test test test test test test test test test test test test test';
    try {
      await service.splitSubtitle(longText);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return text split in 5 lines', () => {
    const subtitle = 'Another adventure-filled year awaits you, and we hope this one is filled with love, laughter and plenty of cake. Wishing you all the great things in life.';
    const lines = [
      'Another adventure-filled year awaits',
      'you, and we hope this one is filled',
      'with love, laughter and plenty of cake.',
      'Wishing you all the great things in',
      'life.'
    ];
    expect(service.splitSubtitle(subtitle)).toEqual(lines);
  });
});