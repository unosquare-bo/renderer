import { BadRequestException, Injectable } from '@nestjs/common';
import ImageData from '../../types/ImageData';
import { SirvCdnService } from '../sirv-cdn/sirv-cdn.service';
import { Observable, map, switchMap } from 'rxjs';
import { SlackBotApiService } from '../slack-bot-api/slack-bot-api.service';

@Injectable()
export class RendererService {
  constructor(
    private readonly sirvCdnService: SirvCdnService,
    private readonly slackBotApiService: SlackBotApiService
  ) { }

  charactersPerLine = 40;

  splitSubtitle(subtitle: string): string[] {
    if (!subtitle) {
      return [];
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
    return this.sirvCdnService.getTopicImages(topic).pipe(
      switchMap(cdnImages => {
        const fileNames = cdnImages.map(({ filename }) => filename);
        return this.slackBotApiService.getImagesData(fileNames)
          .pipe(
            map(imagesData => {
              return cdnImages.map(({ filename, meta }) => {
                const file = imagesData.find(({ fileName }) => fileName === filename);
                return { ...file, width: meta.width, height: meta.height };
              });
            }))
      }));
  }
}
