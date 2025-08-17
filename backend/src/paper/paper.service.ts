import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaperDto } from './dto/create-paper.dto';

@Injectable()
export class PaperService {
  constructor(private prisma: PrismaService) {}

  async create(
    uploaderId: number,
    createPaperDto: CreatePaperDto,
    filePath: string,
  ) {
    const newPaper = await this.prisma.paper.create({
      data: {
        ...createPaperDto,
        filePath,
        uploader: {
          connect: {
            id: uploaderId,
          },
        },
      },
    });
    return newPaper;
  }

  async findOne(id: number) {
    const paper = await this.prisma.paper.findUnique({
      where: { id },
      include: {
        evidences: true,
        comments: true,
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }

    return paper;
  }

  async findAll(page: number, pageSize: number) {
    const papers = await this.prisma.paper.findMany({
      where: {
        status: 'APPROVED',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return papers;
  }

  async getReportPackage(id: number) {
    const paper = await this.prisma.paper.findUnique({
      where: { id },
    });

    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }

    const evidences = await this.prisma.evidence.findMany({
      where: {
        paperId: id,
        status: 'APPROVED',
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const errorComments = await this.prisma.comment.findMany({
      where: {
        paperId: id,
        isError: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      paper,
      evidences,
      errorComments,
    };
  }
}
