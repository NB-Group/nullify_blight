import type { Request } from 'express';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(req: Request): Promise<{
        stats: {
            papersUploaded: number;
            papersApproved: number;
            papersRejected: number;
            papersPending: number;
            auditsCompleted: number;
            auditAccuracy: number;
        };
        recentActivities: {
            id: number;
            type: string;
            title: string;
            timestamp: Date;
            status: import("@prisma/client").$Enums.Status;
        }[];
    }>;
}
