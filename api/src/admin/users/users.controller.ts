import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileService } from 'src/shared/profile/profile.service';
import { UpdateProfileDto } from 'src/shared/profile/dto/update-profile.dto';
import { AllAdminsGuard } from 'src/shared/auth/all-admins.guard';
import { UpdatePasswordDto } from 'src/shared/profile/dto/update-password.dto';
import { SuperUserGuard } from 'src/shared/auth/super-user.guard';

@Controller('users')
@ApiTags('Admin Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
  ) {}

  @UseGuards(SuperUserGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(SuperUserGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(SuperUserGuard)
  @Patch('update-user/:id')
  update_user(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update_user(+id, updateUserDto);
  }

  @UseGuards(AllAdminsGuard)
  @Patch(':id')
  update_profile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(+id, updateProfileDto);
  }

  @UseGuards(AllAdminsGuard)
  @Patch('update-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.profileService.updatePassword(+id, updatePasswordDto);
  }

  @UseGuards(SuperUserGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete_user(+id);
  }
}
