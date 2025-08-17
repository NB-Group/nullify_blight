import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ArxivService {
    private readonly httpService;
    private readonly prisma;
    private readonly logger;
    constructor(httpService: HttpService, prisma: PrismaService);
    fetchAndStorePapers(): Promise<void>;
}
