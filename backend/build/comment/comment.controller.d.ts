import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import type { Request } from 'express';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(createCommentDto: CreateCommentDto, req: Request): Promise<{
        createdAt: Date;
        id: number;
        paperId: number;
        content: string;
        isError: boolean;
        authorId: number;
    }>;
}
