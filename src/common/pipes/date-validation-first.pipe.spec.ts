import { BadRequestException } from '@nestjs/common';
import { RendererParameters } from '../types/RendererParameters';
import { DateValidationFirstPipe } from './date-validation-first.pipe';

describe('DateValidationFirstPipe', () => {
  let pipe: DateValidationFirstPipe;
  let parameters: RendererParameters;

  beforeEach(() => {
    parameters = {
      name: 'John Doe',
      title: 'Happy birthday',
      subtitle: 'We wish you a happy birthday',
      topic: 'birthday',
      uid: 'gunther.revollo',
      date: ''
    };
    pipe = new DateValidationFirstPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw bad request exception if date string is not valid', () => {
    parameters.date = '2023-15-53';
    try {
      pipe.transform(parameters);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return same parameters if date string is valid', () => {
    parameters.date = '2023-05-01';
    const value = pipe.transform(parameters);
    expect(value).toEqual(parameters);
  });
});
