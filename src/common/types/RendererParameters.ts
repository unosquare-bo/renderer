import { IsNotEmpty, MaxLength } from 'class-validator';

export class RendererParameters {
  @IsNotEmpty()
  name: string

  title: string;

  @MaxLength(200)
  subtitle: string;

  uid: string;
  date: string;

  @IsNotEmpty()
  topic: string;
}
