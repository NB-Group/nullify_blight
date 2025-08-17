import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token/access-token.guard';
import { AuditService } from './audit.service';
import type { Request } from 'express';
import { SubmitAuditDto } from './dto/submit-audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('task')
  @UseGuards(AccessTokenGuard)
  getTask(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.auditService.getTask(userId);
  }

  @Post('submit')
  @UseGuards(AccessTokenGuard)
  submit(@Req() req: Request, @Body() submitAuditDto: SubmitAuditDto) {
    const userId = req.user['sub'];
    return this.auditService.submit(userId, submitAuditDto);
  }
}
