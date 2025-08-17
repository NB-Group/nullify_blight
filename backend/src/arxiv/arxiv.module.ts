import { Module } from '@nestjs/common';
import { ArxivService } from './arxiv.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ArxivService],
})
export class ArxivModule {}
