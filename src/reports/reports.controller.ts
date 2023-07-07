import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorators';
import { User } from '../users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsServices: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDTO) {
    return this.reportsServices.createEstimate(query);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() report: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsServices.create(report, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  changeReportApproval(
    @Param('id') id: string,
    @Body() body: ApproveReportDTO,
  ) {
    return this.reportsServices.changeApproval(id, body.approved);
  }
}
