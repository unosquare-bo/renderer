import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface ImageData {
  imageKey: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable()
export class RendererService {
  genericTitle = 'Congratulations!';
  topicImages = {
    birthday: [
      {
        imageKey: 'cake.png',
        x: 120,
        y: 80,
        width: 640,
        height: 463
      }
    ],
    sat: [],
    bonus: [],
    promotion: [],
    anniversary: [],
    congrats: []
  };
  charactersPerLine = 40;
  maxSubtitleLength = 200;

  getTitle(title: string): string {
    return title || this.genericTitle;
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

  getImagesForTopic(topic: string): ImageData[] {
    return this.topicImages[topic] || [];
  }
}
