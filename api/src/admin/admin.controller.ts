import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllAdminsGuard } from 'src/auth/all-admins.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AllAdminsGuard)
@ApiTags('Admin Dashboard')
@ApiBearerAuth('defaultBearerAuth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  get_overview(@Query() query: Object) {
    return this.adminService.get_overview(query);
  }
}
