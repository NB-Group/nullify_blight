import { AuditService } from './audit.service';
import type { Request } from 'express';
import { SubmitAuditDto } from './dto/submit-audit.dto';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getTask(req: Request): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        title: string;
        abstract: string;
        filePath: string;
        isPublic: boolean;
        errorCount: number;
        status: import(".prisma/client").$Enums.Status;
        uploaderId: number | null;
    }>;
    submit(req: Request, submitAuditDto: SubmitAuditDto): Promise<{
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
