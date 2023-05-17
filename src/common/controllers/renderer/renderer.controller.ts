import { Controller, Get, StreamableFile, Header, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { RendererService } from '../../services/renderer/renderer.service';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RendererParameters } from '../../types/RendererParameters';
import { DateValidationFirstPipe } from '../../pipes/date-validation-first.pipe';
import { TopicExistsPipe } from '../../pipes/topic-exists.pipe';
import { UidExistsPipe } from '../../pipes/uid-exists.pipe';

@Controller('renderer')
export class RendererController {
  constructor(private readonly rendererService: RendererService, private configService: ConfigService) { }

  @Get()
  @UsePipes(
    DateValidationFirstPipe,
    new ValidationPipe({ transform: true })
  )
  @Header('Content-Type', 'image/png')
  async renderCongrats(@Query(TopicExistsPipe, UidExistsPipe) query: RendererParameters): Promise<StreamableFile> {
    const cdnUrl = this.configService.get('CDN_URL');
    const width = 1920;
    const height = 1080;

    // Add post object with the content to render
    const post = {
      title: query.title,
      subtitle: this.rendererService.splitSubtitle(query.subtitle)
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    const background = await loadImage(`${cdnUrl}/Images/background.jpg`);
    context.drawImage(background, 0, 0, 1920, 1080);

    // add confetti
    const confetti = await loadImage(`${cdnUrl}/Images/confetti.png`);
    context.drawImage(confetti, 896, 120, 1024, 678);

    const topicImages = await firstValueFrom(this.rendererService.getImagesForTopic(query.topic));
    for (const { fileName, x, y, width, height } of topicImages) {
      const image = await loadImage(`${cdnUrl}/Images/topics/${query.topic}/${fileName}`);
      context.drawImage(image, x, y, width, height);
    }

    // Render User
    const user = await loadImage(`${cdnUrl}/Images/users/${query.uid}.jpg`);
    context.drawImage(user, width - 640, 320, 320, 320);

    // Set the style of the test and render it to the canvas
    context.font = "bold 45pt 'Segoe UI'";
    context.textAlign = "center";
    context.fillStyle = "#000";

    const center = 450

    context.fillText(query.name, width - 480, 720);
    context.fillText(query.date, width - 480, 820);

    const row = 640
    context.fillText(post.title, center, row);

    context.font = "25pt 'Segoe UI'";
    post.subtitle.forEach((txt, idx) => {
      context.fillText(txt, center, (row + 100) + (idx * 55));
    })

    const buffer = canvas.toBuffer("image/png");

    return new StreamableFile(buffer);
  }
}
