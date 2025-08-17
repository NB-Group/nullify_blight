import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/common/guards/access-token/access-token.guard';
import { CreatePaperDto } from './dto/create-paper.dto';
import { PaperService } from './paper.service';
import type { Request } from 'express';

@Controller('paper')
export class PaperController {
  constructor(private readonly paperService: PaperService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPaperDto: CreatePaperDto,
    @Req() req: Request,
  ) {
    const userId = req.user['sub'];
    return this.paperService.create(userId, createPaperDto, file.path);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paperService.findOne(id);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.paperService.findAll(page, pageSize);
  }

  @Get(':id/report-package')
  getReportPackage(@Param('id', ParseIntPipe) id: number) {
    return this.paperService.getReportPackage(id);
  }
}
