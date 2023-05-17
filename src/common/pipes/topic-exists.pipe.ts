import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { SirvCdnService } from "../services/sirv-cdn/sirv-cdn.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TopicExistsPipe implements PipeTransform {
  constructor(private readonly sirvCdnService: SirvCdnService) { }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const topics = await firstValueFrom(this.sirvCdnService.getTopics());
    if (!topics.find(({ filename }) => filename === value.topic)) {
      throw new NotFoundException('Topic not found.');
    }
    return value;
  }
}
