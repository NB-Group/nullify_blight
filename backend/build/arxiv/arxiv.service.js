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
var ArxivService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArxivService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const prisma_service_1 = require("../prisma/prisma.service");
const rxjs_1 = require("rxjs");
const xml2js_1 = require("xml2js");
const schedule_1 = require("@nestjs/schedule");
let ArxivService = ArxivService_1 = class ArxivService {
    constructor(httpService, prisma) {
        this.httpService = httpService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(ArxivService_1.name);
    }
    async fetchAndStorePapers() {
        this.logger.log('Starting to fetch papers from arXiv...');
        const url = 'http://export.arxiv.org/api/query?search_query=cat:cs.*&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending';
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const xml = response.data;
            const result = await (0, xml2js_1.parseStringPromise)(xml);
            const entries = result.feed.entry;
            for (const entry of entries) {
                const title = entry.title[0].trim();
                const abstract = entry.summary[0].trim();
                const arxivId = entry.id[0].split('/abs/')[1];
                const pdfLink = `http://arxiv.org/pdf/${arxivId}.pdf`;
                const existingPaper = await this.prisma.paper.findFirst({
                    where: { filePath: pdfLink },
                });
                if (!existingPaper) {
                    await this.prisma.paper.create({
                        data: {
                            title,
                            abstract,
                            filePath: pdfLink,
                            isPublic: true,
                        },
                    });
                    this.logger.log(`Stored new paper: ${title}`);
                }
                else {
                    this.logger.log(`Skipping existing paper: ${title}`);
                }
            }
            this.logger.log('Finished fetching papers from arXiv.');
        }
        catch (error) {
            this.logger.error('Failed to fetch or store papers from arXiv', error);
        }
    }
};
exports.ArxivService = ArxivService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArxivService.prototype, "fetchAndStorePapers", null);
exports.ArxivService = ArxivService = ArxivService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        prisma_service_1.PrismaService])
], ArxivService);
//# sourceMappingURL=arxiv.service.js.map