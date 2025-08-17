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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const APPROVAL_THRESHOLD = 3;
const REJECTION_THRESHOLD = 3;
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTask(userId) {
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
            throw new common_1.NotFoundException('No pending audit tasks available.');
        }
        const randomIndex = Math.floor(Math.random() * pendingPapers.length);
        return pendingPapers[randomIndex];
    }
    async submit(userId, submitAuditDto) {
        const { paperId, decision } = submitAuditDto;
        return this.prisma.$transaction(async (tx) => {
            const existingAudit = await tx.audit.findUnique({
                where: {
                    auditorId_paperId: {
                        auditorId: userId,
                        paperId,
                    },
                },
            });
            if (existingAudit) {
                throw new common_1.ConflictException('You have already audited this paper.');
            }
            const newAudit = await tx.audit.create({
                data: {
                    auditorId: userId,
                    paperId,
                    decision,
                },
            });
            const audits = await tx.audit.findMany({
                where: { paperId },
            });
            const approvals = audits.filter((a) => a.decision).length;
            const rejections = audits.filter((a) => !a.decision).length;
            let updatedPaper;
            if (approvals >= APPROVAL_THRESHOLD) {
                updatedPaper = await tx.paper.update({
                    where: { id: paperId },
                    data: { status: 'APPROVED' },
                });
            }
            else if (rejections >= REJECTION_THRESHOLD) {
                updatedPaper = await tx.paper.update({
                    where: { id: paperId },
                    data: { status: 'REJECTED' },
                });
            }
            return { newAudit, paperStatus: updatedPaper?.status || 'PENDING' };
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map