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
    day: 'numeric'
  }))
  date: string;

  @IsNotEmpty()
  topic: string;
}
