import { CreatePaperDto } from './dto/create-paper.dto';
import { PaperService } from './paper.service';
import type { Request } from 'express';
export declare class PaperController {
    private readonly paperService;
    constructor(paperService: PaperService);
    create(file: Express.Multer.File, createPaperDto: CreatePaperDto, req: Request): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        abstract: string;
        filePath: string;
        isPublic: boolean;
        errorCount: number;
        status: import("@prisma/client").$Enums.Status;
        uploaderId: number | null;
    }>;
    findOne(id: number): Promise<{
        evidences: {
            createdAt: Date;
            id: number;
            filePath: string;
            status: import("@prisma/client").$Enums.Status;
            uploaderId: number;
            description: string;
            paperId: number;
        }[];
        comments: {
            createdAt: Date;
            id: number;
            paperId: number;
            content: string;
            isError: boolean;
            authorId: number;
        }[];
        uploader: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        abstract: string;
        filePath: string;
        isPublic: boolean;
        errorCount: number;
        status: import("@prisma/client").$Enums.Status;
        uploaderId: number | null;
    }>;
    findAll(page: number, pageSize: number): Promise<({
        uploader: {
            name: string;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        abstract: string;
        filePath: string;
        isPublic: boolean;
        errorCount: number;
        status: import("@prisma/client").$Enums.Status;
        uploaderId: number | null;
    })[]>;
    getReportPackage(id: number): Promise<{
        paper: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
            abstract: string;
            filePath: string;
            isPublic: boolean;
            errorCount: number;
            status: import("@prisma/client").$Enums.Status;
            uploaderId: number | null;
        };
        evidences: ({
            uploader: {
                name: string;
                id: number;
            };
        } & {
            createdAt: Date;
            id: number;
            filePath: string;
            status: import("@prisma/client").$Enums.Status;
            uploaderId: number;
            description: string;
            paperId: number;
        })[];
        errorComments: ({
            author: {
                name: string;
                id: number;
            };
        } & {
            createdAt: Date;
            id: number;
            paperId: number;
            content: string;
            isError: boolean;
            authorId: number;
        })[];
    }>;
}
