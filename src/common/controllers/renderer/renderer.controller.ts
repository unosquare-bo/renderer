import { Controller, Get, StreamableFile, Header, Query } from '@nestjs/common';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { RendererService } from 'src/common/services/renderer/renderer.service';
import { ConfigService } from '@nestjs/config';

@Controller('renderer')
export class RendererController {
  constructor(private readonly rendererService: RendererService, private configService: ConfigService) { }

  @Get()
  @Header('Content-Type', 'image/png')
  async renderCongrats(@Query() query): Promise<StreamableFile> {
    const width = 1920;
    const height = 1080;

    // Add post object with the content to render
    const post = {
      title: this.rendererService.getTitle(query.title),
      subtitle: this.rendererService.splitSubtitle(query.subtitle)
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    const background = await loadImage('https://grandint.sirv.com/Images/background.jpg');
    const confetti = await loadImage('https://grandint.sirv.com/Images/confetti.png');

    let user
    try {
      user = await loadImage(`https://grandint.sirv.com/Images/users/${query.uid}.jpg`)
    } catch (error) {
      console.log(error)
      user = await loadImage('https://grandint.sirv.com/Images/default.jpg');
    }

    context.drawImage(background, 0, 0, 1920, 1080);

    const topicImages = this.rendererService.getImagesForTopic(query.topic);
    for (const { imageKey, x, y, width, height } of topicImages) {
      const image = await loadImage(`${this.configService.get('CDN_URL')}/Images/${imageKey}`);
      context.drawImage(image, x, y, width, height);
    }

    // add confetti
    context.drawImage(confetti, 896, 120, 1024, 678);
    // Render User
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
