import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RendererController } from './common/controllers/renderer/renderer.controller';
import { RendererService } from './common/services/renderer/renderer.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AppController, RendererController],
  providers: [AppService, RendererService],
})
export class AppModule {}
