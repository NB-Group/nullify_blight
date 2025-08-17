import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(authorId: number, createCommentDto: CreateCommentDto): Promise<{
        createdAt: Date;
        id: number;
        paperId: number;
        content: string;
        isError: boolean;
        authorId: number;
    }>;
}
