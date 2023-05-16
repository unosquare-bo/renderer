import { IsEmail, IsNotEmpty } from 'class-validator';

export class RendererParameters {
  @IsNotEmpty()
  name: string

  title: string;
  subtitle: string;
  uid: string;
  date: string;

  @IsNotEmpty()
  topic: string;
}
