import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { format, parseISO } from 'date-fns';

export class RendererParameters {
  @IsNotEmpty()
  name: string

  @IsOptional()
  @MaxLength(25)
  title: string = 'Congratulations!';

  @MaxLength(200)
  subtitle: string;

  @IsOptional()
  uid: string = 'default';

  @Transform(({ value }) => format(parseISO(value), 'MMMM do, yyyy'))
  date: string;

  @IsNotEmpty()
  topic: string;
}
