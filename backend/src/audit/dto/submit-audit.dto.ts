import { IsBoolean, IsInt } from 'class-validator';

export class SubmitAuditDto {
  @IsInt()
  paperId: number;

  @IsBoolean()
  decision: boolean;
}
