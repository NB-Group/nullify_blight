import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserDashboard(userId: number): Promise<{
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
