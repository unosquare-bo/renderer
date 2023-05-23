import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isDateString } from "class-validator";
import { RendererParameters } from "../types/RendererParameters";

@Injectable()
export class DateValidationFirstPipe implements PipeTransform<RendererParameters, RendererParameters> {
  transform(value: RendererParameters): RendererParameters {
    if (!isDateString(value.date)) {
      throw new BadRequestException('Date should be in ISO format');
    }
    return value;
  }
}