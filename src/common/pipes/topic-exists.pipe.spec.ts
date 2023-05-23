import { NotFoundException } from '@nestjs/common';
import { RendererParameters } from '../types/RendererParameters';
import { TopicExistsPipe } from './topic-exists.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { SirvCdnFileData } from '../services/sirv-cdn/sirv-cdn.types';
import { of } from 'rxjs';

describe('TopicExistsPipe', () => {
  let pipe: TopicExistsPipe;
  let parameters: RendererParameters;
  const topicsResponse: SirvCdnFileData[] = [
    { filename: 'birthday', meta: {} },
    { filename: 'promotion', meta: {} }
  ];

  beforeEach(async () => {
    parameters = {
      name: 'John Doe',
      title: 'Happy birthday',
      subtitle: 'We wish you a happy birthday',
      topic: '',
      uid: 'gunther.revollo',
      date: '2023-05-01'
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicExistsPipe],
    })
      .useMocker(() => {
        return { getTopics: jest.fn(() => of(topicsResponse)) }
      })
      .compile();
    pipe = module.get<TopicExistsPipe>(TopicExistsPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw not found exception if topic does not exist', async () => {
    parameters.topic = 'unknown';
    try {
      await pipe.transform(parameters);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return same parameters if topic exists', async () => {
    parameters.topic = 'birthday';
    const value = await pipe.transform(parameters);
    expect(value).toEqual(parameters);
  });
});
