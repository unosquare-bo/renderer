import { Test, TestingModule } from '@nestjs/testing';
import { RendererService } from './renderer.service';
import { BadRequestException } from '@nestjs/common';
import { SirvCdnService } from '../sirv-cdn/sirv-cdn.service';
import { of } from 'rxjs';
import { SirvCdnFileData } from '../sirv-cdn/sirv-cdn.types';
import { SlackBotApiService } from '../slack-bot-api/slack-bot-api.service';
import { SlackBotApiImageData } from '../slack-bot-api/slack-bot-api.types';

describe('RendererService', () => {
  let service: RendererService;
  const topicImages: SirvCdnFileData[] = [
    { filename: 'cake.png', meta: { width: 500, height: 600 } },
    { filename: 'balloons.png', meta: { width: 150, height: 400 } },
  ];
  const imagesData: SlackBotApiImageData[] = [
    { id: 1, fileName: 'cake.png', x: 120, y: 80 },
    { id: 2, fileName: 'balloons.png', x: 10, y: 20 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RendererService],
    })
      .useMocker(token => {
        if (token === SirvCdnService) {
          return { getTopicImages: jest.fn(() => of(topicImages)) };
        }
        if (token === SlackBotApiService) {
          return { getImagesData: jest.fn(() => of(imagesData)) };
        }
      })
      .compile();

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
    expect(subtitle).toEqual([]);
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

  it('should return the images for birthday topic', done => {
    const topic = 'birthday';
    const birthdayImages = [
      { id: 1, fileName: 'cake.png', x: 120, y: 80, width: 500, height: 600 },
      { id: 2, fileName: 'balloons.png', x: 10, y: 20, width: 150, height: 400 }
    ];
    service.getImagesForTopic(topic).subscribe(response => {
      expect(response).toEqual(birthdayImages);
      done();
    });
  });
});
