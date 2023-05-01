import { Test, TestingModule } from '@nestjs/testing';
import { RendererController } from './renderer.controller';

describe('RendererController', () => {
  let controller: RendererController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RendererController],
    }).compile();

    controller = module.get<RendererController>(RendererController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
