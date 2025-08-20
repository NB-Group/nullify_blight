import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaperDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  abstract: string;
}
