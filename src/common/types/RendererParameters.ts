import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RendererParameters {
  @IsNotEmpty()
  name: string

  @IsOptional()
  title: string = 'Congratulations!';

  @MaxLength(200)
  subtitle: string;

  @IsOptional()
  uid: string;

  @Transform(({ value }) => new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }))
  date: string;

  @IsNotEmpty()
  topic: string;
}
/* todo update readme, sirvcdn para validar uid, sirvcdn para validar topic, tests, UTC */