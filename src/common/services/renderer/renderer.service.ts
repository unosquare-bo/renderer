import { BadRequestException, Injectable } from '@nestjs/common';
import ImageData from '../../types/ImageData';
import { SirvCdnService } from '../sirv-cdn/sirv-cdn.service';
import { Observable, map } from 'rxjs';

@Injectable()
export class RendererService {
  constructor(private readonly sirvCdnService: SirvCdnService) { }

  genericTitle = 'Congratulations!';
  topicImages = [
    {
      fileName: 'cake.png',
      x: 120,
      y: 80,
    }
  ];
  charactersPerLine = 40;
  maxSubtitleLength = 200;

  getTitle(title: string): string {
    return title || this.genericTitle;
  }

  splitSubtitle(subtitle: string): string[] {
    if (subtitle.length > this.maxSubtitleLength) {
      throw new BadRequestException('The subtitle must not exceed 200 characters');
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

  getImagesForTopic(topic: string): Observable<ImageData[]> {
    return this.sirvCdnService.getTopicImages(topic).pipe(map(({ data }) => {
      return data.contents.map(({ filename, meta }) => {
        const file = this.topicImages.find(({ fileName }) => fileName === filename);
        return { ...file, width: meta.width, height: meta.height };
      });
    }));
  }
}
