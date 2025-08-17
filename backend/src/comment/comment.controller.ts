import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token/access-token.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import type { Request } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.commentService.create(userId, createCommentDto);
  }
}
