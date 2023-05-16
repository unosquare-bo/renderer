import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isDateString } from "class-validator";

@Injectable()
export class DateValidationFirstPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isDateString(value.date)) {
      throw new BadRequestException('Date should be in ISO format');
    }
    return value;
  }
}