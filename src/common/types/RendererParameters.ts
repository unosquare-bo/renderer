import { IsEmail, IsNotEmpty } from 'class-validator';

export class RendererParameters {
  @IsNotEmpty()
  name: string
}