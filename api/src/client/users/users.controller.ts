import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomerGuard } from 'src/auth/customer.guard';
import { UpdateProfileDto } from 'src/shared/profile/dto/update-profile.dto';
import { ProfileService } from 'src/shared/profile/profile.service';
import { UpdatePasswordDto } from 'src/shared/profile/dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
  ) {}

  @Post()
  create_user(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create_user(createUserDto);
  }

  @UseGuards(CustomerGuard)
  @Patch(':id')
  update_profile(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const logged_in_user = request['logged_in_user'];
    return this.profileService.updateProfile(
      +id,
      logged_in_user,
      updateProfileDto,
    );
  }

  @UseGuards(CustomerGuard)
  @Patch('update-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const logged_in_user = request['logged_in_user'];
    return this.profileService.updatePassword(
      +id,
      logged_in_user,
      updatePasswordDto,
    );
  }

  @UseGuards(CustomerGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const logged_in_user = request['logged_in_user'];
    return this.usersService.remove(+id, logged_in_user);
  }
}
