import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: number, createCommentDto: CreateCommentDto) {
    const { paperId, isError, ...commentData } = createCommentDto;

    // Use a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          ...commentData,
          isError,
          author: {
            connect: { id: authorId },
          },
          paper: {
            connect: { id: paperId },
          },
        },
      });

      if (isError) {
        await tx.paper.update({
          where: { id: paperId },
          data: {
            errorCount: {
              increment: 1,
            },
          },
        });
      }

      return newComment;
    });
  }
}
