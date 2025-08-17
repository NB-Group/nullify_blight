import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ArxivService {
  private readonly logger = new Logger(ArxivService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchAndStorePapers() {
    this.logger.log('Starting to fetch papers from arXiv...');
    const url =
      'http://export.arxiv.org/api/query?search_query=cat:cs.*&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending';

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const xml = response.data;
      const result = await parseStringPromise(xml);

      const entries = result.feed.entry;

      for (const entry of entries) {
        const title = entry.title[0].trim();
        const abstract = entry.summary[0].trim();
        const arxivId = entry.id[0].split('/abs/')[1];
        const pdfLink = `http://arxiv.org/pdf/${arxivId}.pdf`;

        // Avoid duplicates
        const existingPaper = await this.prisma.paper.findFirst({
            where: { filePath: pdfLink },
        });

        if (!existingPaper) {
            await this.prisma.paper.create({
              data: {
                title,
                abstract,
                filePath: pdfLink, // Storing the PDF link in filePath
                isPublic: true,
                // uploaderId is optional and thus null by default
              },
            });
            this.logger.log(`Stored new paper: ${title}`);
        } else {
            this.logger.log(`Skipping existing paper: ${title}`);
        }
      }
      this.logger.log('Finished fetching papers from arXiv.');
    } catch (error) {
      this.logger.error('Failed to fetch or store papers from arXiv', error);
    }
  }
}
