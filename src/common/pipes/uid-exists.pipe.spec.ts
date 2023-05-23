import { RendererParameters } from '../types/RendererParameters';
import { UidExistsPipe } from './uid-exists.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { SirvCdnFileData } from '../services/sirv-cdn/sirv-cdn.types';
import { of } from 'rxjs';

describe('UidExistsPipe', () => {
  let pipe: UidExistsPipe;
  const usersResponse: SirvCdnFileData[] = [
    { filename: 'arleth.vargas.jpg', meta: {} },
    { filename: 'diego.landa.jpg', meta: {} },
    { filename: 'gunther.revollo.jpg', meta: {} },
  ];
  let parameters: RendererParameters;

  beforeEach(async () => {
    parameters = {
      name: 'John Doe',
      title: 'Happy birthday',
      subtitle: 'We wish you a happy birthday',
      topic: 'unknown',
      uid: '',
      date: '2023-05-01'
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [UidExistsPipe],
    })
      .useMocker(() => {
        return { getUsers: jest.fn(() => of(usersResponse)) }
      })
      .compile();
    pipe = module.get<UidExistsPipe>(UidExistsPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should change uid to default if it does not exist', async () => {
    parameters.uid = 'juan.perez';
    const value = await pipe.transform(parameters);
    expect(value.uid).toBe('default');
  });

  it('should keep uid if it exists', async () => {
    const existantUid = 'gunther.revollo';
    parameters.uid = existantUid;
    const value = await pipe.transform(parameters);
    expect(value.uid).toEqual(existantUid);
  });
});
