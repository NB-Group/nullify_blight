import { PrismaService } from 'src/prisma/prisma.service';
import { SubmitAuditDto } from './dto/submit-audit.dto';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    getTask(userId: number): Promise<{
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
    submit(userId: number, submitAuditDto: SubmitAuditDto): Promise<{
        newAudit: {
            createdAt: Date;
            id: number;
            paperId: number | null;
            decision: boolean;
            auditorId: number;
            evidenceId: number | null;
        };
        paperStatus: any;
    }>;
}
