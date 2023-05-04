import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class RendererService {
  genericTitle = 'Congratulations!';
  topicTitles = {
    birthday: 'Happy Birthday!',
    promotion: 'You just got promoted!',
  };
  charactersPerLine = 40;
  maxSubtitleLength = 200;

  getTitle(topic: string): string {
    return this.topicTitles[topic] || this.genericTitle;
  }

  splitSubtitle(subtitle: string): string[] {
    if (subtitle.length > this.maxSubtitleLength) {
      throw new HttpException('The subtitle must not exceed 200 characters', HttpStatus.BAD_REQUEST);
    }

    const words = subtitle.split(' ');
    const lines = [''];
    let currentLine = 0;
    words.forEach((word, index) => {
      const lineContent = index === 0 ? word : `${lines[currentLine]} ${word}`;
      if (lineContent.length < this.charactersPerLine) {
        lines[currentLine] = lineContent;
      } else {
        currentLine++;
        lines[currentLine] = word;
      }
    });
    return lines;
  }
}
