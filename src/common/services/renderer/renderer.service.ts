import { Injectable } from '@nestjs/common';

@Injectable()
export class RendererService {
  genericTitle = 'Congratulations!';
  topicTitles = {
    'birthday': 'Happy Birthday!',
    'promotion': 'You just got promoted!',
  };

  getTitle(topic: string): string {
    return this.topicTitles[topic] || this.genericTitle;
  }
}
