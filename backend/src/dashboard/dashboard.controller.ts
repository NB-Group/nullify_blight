import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token/access-token.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getDashboard(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.dashboardService.getUserDashboard(userId);
  }
}



