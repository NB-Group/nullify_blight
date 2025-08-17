import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaperDto } from './dto/create-paper.dto';
export declare class PaperService {
    private prisma;
    constructor(prisma: PrismaService);
    create(uploaderId: number, createPaperDto: CreatePaperDto, filePath: string): Promise<{
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
