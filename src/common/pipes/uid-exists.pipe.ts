import { Injectable, PipeTransform } from "@nestjs/common";
import { SirvCdnService } from "../services/sirv-cdn/sirv-cdn.service";
import { firstValueFrom } from "rxjs";
import { RendererParameters } from "../types/RendererParameters";

@Injectable()
export class UidExistsPipe implements PipeTransform<RendererParameters, Promise<RendererParameters>> {
  constructor(private readonly sirvCdnService: SirvCdnService) { }

  async transform(value: RendererParameters): Promise<RendererParameters> {
    const users = await firstValueFrom(this.sirvCdnService.getUsers());
    if (!users.find(({ filename }) => filename.includes(value.uid))) {
      value.uid = 'default';
    }
    return value;
  }
}
