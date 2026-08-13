import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import type { AuthUser } from 'src/shared/types/auth-user';
import { CloudinaryFolderDto } from './dtos/cloudinary-folder.dto';
import 'multer';

@Controller('cloudinary')
@UseGuards(AuthGuard)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post('upload')
  @ResponseMessage('Image uploaded successfully')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CloudinaryFolderDto,
    @User() user: AuthUser,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.cloudinaryService.uploadFile(file, body.folderName, user);
  }

  @Get('generate-signature')
  @ResponseMessage('Signature generated successfully')
  generateSignature(
    @Query() query: CloudinaryFolderDto,
    @User() user: AuthUser,
  ) {
    return this.cloudinaryService.generateSignature(query.folderName, user);
  }
}
