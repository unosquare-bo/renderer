import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RendererController } from './common/controllers/renderer/renderer.controller';

@Module({
  imports: [],
  controllers: [AppController, RendererController],
  providers: [AppService],
})
export class AppModule {}
