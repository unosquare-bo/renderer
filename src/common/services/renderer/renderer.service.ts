import { Injectable } from '@nestjs/common';

@Injectable()
export class RendererService {
  genericTitle = 'Congratulations!';
  topicTitles = {
    'birthday': 'Happy Birthday!',
    'promotion': 'Congratulations for the promotion!',
  };

  getTitle(topic: string): string {
    return this.topicTitles[topic] || this.genericTitle;
  }
}
