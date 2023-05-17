import { NotFoundException } from '@nestjs/common';
import { RendererParameters } from '../types/RendererParameters';
import { TopicExistsPipe } from './topic-exists.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { SirvCdnFileData } from '../services/sirv-cdn/sirv-cdn.types';
import { of } from 'rxjs';

describe('TopicExistsPipe', () => {
  let pipe: TopicExistsPipe;
  const topicsResponse: SirvCdnFileData[] = [
    { filename: 'birthday', meta: {} },
    { filename: 'promotion', meta: {} }
  ];
  const parameters: RendererParameters = {
    name: 'John Doe',
    title: 'Happy birthday',
    subtitle: 'We wish you a happy birthday',
    topic: 'unknown',
    uid: 'gunther.revollo',
    date: '2023-05-01'
  };

  beforeEach(async () => {
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
    try {
      await pipe.transform(parameters);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return same parameters if topic exists', async () => {
    const birthdayParameters = { ...parameters, topic: 'birthday' }
    const value = await pipe.transform(birthdayParameters);
    expect(value).toEqual(birthdayParameters);
  });
});
