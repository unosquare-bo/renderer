import { Test, TestingModule } from '@nestjs/testing';
import { RendererController } from './renderer.controller';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('RendererController', () => {
  let controller: RendererController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RendererController],
    })
    .useMocker(token => {
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();

    controller = module.get<RendererController>(RendererController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
