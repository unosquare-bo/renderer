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

  it('should return Happy Birthday if title is Happy Birthday', () => {
    const title = service.getTitle('Happy Birthday!');
    expect(title).toBe('Happy Birthday!');
  });

  it('should return Congratulations if no title is provided', () => {
    const title = service.getTitle(null);
    expect(title).toBe('Congratulations!');
  });

  it('should throw exception if subtitle exceeds characters', () => {
    const longText = 'Test test test test test test test test test test test test test test test test test test test test Test test test test test test test test test test test test test test test test test test test test test test test test test';
    try {
      service.splitSubtitle(longText);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return empty array if subtitle is null', () => {
    const subtitle = service.splitSubtitle(null);
    expect(subtitle).toBe([]);
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

  it('should return the images for birthday topic', () => {
    const topic = 'birthday';
    const birthdayImages = [
      {
        imageKey: 'cake.png',
        x: 120,
        y: 80,
        width: 640,
        height: 463
      }
    ]
    expect(service.getImagesForTopic(topic)).toEqual(birthdayImages);
  });

  it('should return empty images array for unknown topic', () => {
    const topic = 'unknown';
    expect(service.getImagesForTopic(topic)).toEqual([]);
  });
});