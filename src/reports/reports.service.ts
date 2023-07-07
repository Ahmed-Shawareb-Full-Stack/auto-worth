import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return await this.repo.save(report);
  }

  async createEstimate({
    make,
    model,
    lang,
    lat,
    year,
    milage,
  }: GetEstimateDTO) {
    return await this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lang - :lang BETWEEN -5 AND 5', { lang })
      .andWhere('lat - :lat BETWEEN -5 AND 5 ', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(milage - :milage)', 'DESC')
      .limit(3)
      .getRawOne();
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOneBy({
      id: id as any,
    });
    if (!report) {
      return new NotFoundException('report not found');
    }

    report.approved = approved;

    return await this.repo.save(report);
  }
}
