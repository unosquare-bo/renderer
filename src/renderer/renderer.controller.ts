import { Controller, Get } from '@nestjs/common';

@Controller('renderer')
export class RendererController {
  @Get()
  findAll(): string {
    return 'This action returns all images';
  }
}
