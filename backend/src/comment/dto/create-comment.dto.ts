import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  isError: boolean;

  @IsInt()
  paperId: number;
}
