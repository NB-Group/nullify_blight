"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserDashboard(userId) {
        const [uploaded, approved, rejected, pending, auditsCompleted] = await Promise.all([
            this.prisma.paper.count({ where: { uploaderId: userId } }),
            this.prisma.paper.count({ where: { uploaderId: userId, status: 'APPROVED' } }),
            this.prisma.paper.count({ where: { uploaderId: userId, status: 'REJECTED' } }),
            this.prisma.paper.count({ where: { uploaderId: userId, status: 'PENDING' } }),
            this.prisma.audit.count({ where: { auditorId: userId } }),
        ]);
        const userAudits = await this.prisma.audit.findMany({
            where: { auditorId: userId },
            select: { decision: true, paperId: true },
        });
        let correct = 0;
        if (userAudits.length > 0) {
            const paperIds = Array.from(new Set(userAudits.map((a) => a.paperId).filter(Boolean)));
            const papers = await this.prisma.paper.findMany({
                where: { id: { in: paperIds } },
                select: { id: true, status: true },
            });
            const idToStatus = new Map(papers.map((p) => [p.id, p.status]));
            for (const a of userAudits) {
                const status = idToStatus.get(a.paperId);
                if (!status || status === 'PENDING')
                    continue;
                if ((status === 'APPROVED' && a.decision) || (status === 'REJECTED' && !a.decision)) {
                    correct += 1;
                }
            }
        }
        const auditAccuracy = userAudits.length > 0 ? Math.round((correct / userAudits.length) * 1000) / 10 : 0;
        const recentActivities = await this.prisma.paper.findMany({
            where: { uploaderId: userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: { id: true, title: true, status: true, createdAt: true },
        });
        return {
            stats: {
                papersUploaded: uploaded,
                papersApproved: approved,
                papersRejected: rejected,
                papersPending: pending,
                auditsCompleted,
                auditAccuracy,
            },
            recentActivities: recentActivities.map((p) => ({
                id: p.id,
                type: 'upload',
                title: p.title,
                timestamp: p.createdAt,
                status: p.status,
            })),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map