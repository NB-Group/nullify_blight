import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmitAuditDto } from './dto/submit-audit.dto';

const APPROVAL_THRESHOLD = 3; // Number of approvals needed
const REJECTION_THRESHOLD = 3; // Number of rejections needed

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async getTask(userId: number) {
    // Find papers that are pending, not uploaded by the user,
    // and not already audited by the user.
    const pendingPapers = await this.prisma.paper.findMany({
      where: {
        status: 'PENDING',
        uploaderId: {
          not: userId,
        },
        audits: {
          none: {
            auditorId: userId,
          },
        },
      },
    });

    if (pendingPapers.length === 0) {
      throw new NotFoundException('No pending audit tasks available.');
    }

    // Return a random paper from the list
    const randomIndex = Math.floor(Math.random() * pendingPapers.length);
    return pendingPapers[randomIndex];
  }

  async submit(userId: number, submitAuditDto: SubmitAuditDto) {
    const { paperId, decision } = submitAuditDto;

    return this.prisma.$transaction(async (tx) => {
      // 1. Check if the user has already audited this paper
      const existingAudit = await tx.audit.findUnique({
        where: {
          auditorId_paperId: {
            auditorId: userId,
            paperId,
          },
        },
      });

      if (existingAudit) {
        throw new ConflictException('You have already audited this paper.');
      }

      // 2. Create the new audit record
      const newAudit = await tx.audit.create({
        data: {
          auditorId: userId,
          paperId,
          decision,
        },
      });

      // 3. Count approvals and rejections for this paper
      const audits = await tx.audit.findMany({
        where: { paperId },
      });

      const approvals = audits.filter((a) => a.decision).length;
      const rejections = audits.filter((a) => !a.decision).length;

      // 4. Update paper status if a threshold is reached
      let updatedPaper;
      if (approvals >= APPROVAL_THRESHOLD) {
        updatedPaper = await tx.paper.update({
          where: { id: paperId },
          data: { status: 'APPROVED' },
        });
      } else if (rejections >= REJECTION_THRESHOLD) {
        updatedPaper = await tx.paper.update({
          where: { id: paperId },
          data: { status: 'REJECTED' },
        });
      }

      return { newAudit, paperStatus: updatedPaper?.status || 'PENDING' };
    });
  }
}
