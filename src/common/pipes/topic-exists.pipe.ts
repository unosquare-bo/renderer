import { Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { SirvCdnService } from "../services/sirv-cdn/sirv-cdn.service";
import { firstValueFrom } from "rxjs";
import { RendererParameters } from "../types/RendererParameters";

@Injectable()
export class TopicExistsPipe implements PipeTransform<RendererParameters, Promise<RendererParameters>> {
  constructor(private readonly sirvCdnService: SirvCdnService) { }

  async transform(value: RendererParameters): Promise<RendererParameters> {
    const topics = await firstValueFrom(this.sirvCdnService.getTopics());
    if (!topics.find(({ filename }) => filename === value.topic)) {
      throw new NotFoundException('Topic not found.');
    }
    return value;
  }
}
