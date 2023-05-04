import { Test, TestingModule } from '@nestjs/testing';
import { RendererController } from './renderer.controller';
import { RendererService } from '../../services/renderer/renderer.service';

describe('RendererController', () => {
  let controller: RendererController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RendererController],
      providers: [RendererService]
    }).compile();

    controller = module.get<RendererController>(RendererController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
