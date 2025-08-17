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
exports.PaperService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaperService = class PaperService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(uploaderId, createPaperDto, filePath) {
        const newPaper = await this.prisma.paper.create({
            data: {
                ...createPaperDto,
                filePath,
                uploader: {
                    connect: {
                        id: uploaderId,
                    },
                },
            },
        });
        return newPaper;
    }
    async findOne(id) {
        const paper = await this.prisma.paper.findUnique({
            where: { id },
            include: {
                evidences: true,
                comments: true,
                uploader: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!paper) {
            throw new common_1.NotFoundException(`Paper with ID ${id} not found`);
        }
        return paper;
    }
    async findAll(page, pageSize) {
        const papers = await this.prisma.paper.findMany({
            where: {
                status: 'APPROVED',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return papers;
    }
    async getReportPackage(id) {
        const paper = await this.prisma.paper.findUnique({
            where: { id },
        });
        if (!paper) {
            throw new common_1.NotFoundException(`Paper with ID ${id} not found`);
        }
        const evidences = await this.prisma.evidence.findMany({
            where: {
                paperId: id,
                status: 'APPROVED',
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const errorComments = await this.prisma.comment.findMany({
            where: {
                paperId: id,
                isError: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return {
            paper,
            evidences,
            errorComments,
        };
    }
};
exports.PaperService = PaperService;
exports.PaperService = PaperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaperService);
//# sourceMappingURL=paper.service.js.map