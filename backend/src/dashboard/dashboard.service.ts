import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getUserDashboard(userId: number) {
    const [uploaded, approved, rejected, pending, auditsCompleted] = await Promise.all([
      this.prisma.paper.count({ where: { uploaderId: userId } }),
      this.prisma.paper.count({ where: { uploaderId: userId, status: 'APPROVED' } }),
      this.prisma.paper.count({ where: { uploaderId: userId, status: 'REJECTED' } }),
      this.prisma.paper.count({ where: { uploaderId: userId, status: 'PENDING' } }),
      this.prisma.audit.count({ where: { auditorId: userId } }),
    ]);

    // 简单计算准确率：用户的审核中，与最终论文状态一致的比例
    const userAudits = await this.prisma.audit.findMany({
      where: { auditorId: userId },
      select: { decision: true, paperId: true },
    });

    let correct = 0;
    if (userAudits.length > 0) {
      const paperIds = Array.from(new Set(userAudits.map((a) => a.paperId).filter(Boolean))) as number[];
      const papers = await this.prisma.paper.findMany({
        where: { id: { in: paperIds } },
        select: { id: true, status: true },
      });
      const idToStatus = new Map(papers.map((p) => [p.id, p.status]));
      for (const a of userAudits) {
        const status = idToStatus.get(a.paperId!);
        if (!status || status === 'PENDING') continue;
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
}



