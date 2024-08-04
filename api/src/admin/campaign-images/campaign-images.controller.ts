import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CampaignImagesService } from './campaign-images.service';
import { AllAdminsGuard } from 'src/shared/auth/all-admins.guard';

@Controller('campaign-images')
@UseGuards(AllAdminsGuard)
@ApiTags('Admin Campaign images')
@ApiBearerAuth('defaultBearerAuth')
export class CampaignImagesController {
  constructor(private readonly campaignImagesService: CampaignImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build({
          fileIsRequired: true,
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.campaignImagesService.create(image);
  }

  @Get()
  findAll() {
    return this.campaignImagesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignImagesService.remove(+id);
  }
}
