import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import type { AuthUser } from 'src/shared/types/auth-user';
import { CloudinaryResponse } from './cloudinary-response';
import {
  CLOUDINARY_ROOT,
  type CloudinaryFolderKey,
  isCloudinaryFolderKey,
} from './cloudinary-folders';
import 'multer';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  resolveFolder(folderName: string, user?: AuthUser | null): string {
    const key = folderName?.trim().toLowerCase();

    if (!key || !isCloudinaryFolderKey(key)) {
      throw new BadRequestException(
        `folderName must be one of: categories, variants, avatars`,
      );
    }

    if (
      key.includes('..') ||
      key.includes('/') ||
      key.includes('\\') ||
      key.includes('\0')
    ) {
      throw new BadRequestException('Invalid folderName');
    }

    if (key === 'avatars') {
      if (!user?.id) {
        throw new UnauthorizedException(
          'Authentication required to upload avatars',
        );
      }
      return `${CLOUDINARY_ROOT}/avatars/${user.id}`;
    }

    return `${CLOUDINARY_ROOT}/${key as Exclude<CloudinaryFolderKey, 'avatars'>}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
    user?: AuthUser | null,
  ): Promise<CloudinaryResponse> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('File is required');
    }

    if (!file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image uploads are allowed');
    }

    const folder = this.resolveFolder(folderName, user);

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  generateSignature(folderName: string, user: AuthUser) {
    const folder = this.resolveFolder(folderName, user);
    const timestamp = Math.floor(Date.now() / 1000);

    const cloudName = this.configService.getOrThrow<string>(
      'CLOUDINARY_CLOUD_NAME',
    );
    const apiKey = this.configService.getOrThrow<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.getOrThrow<string>(
      'CLOUDINARY_API_SECRET',
    );

    const paramsToSign = {
      timestamp,
      folder,
      invalidate: true,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    return {
      signature,
      timestamp,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      cloudName,
      folderName: folder,
      apiKey,
    };
  }
}
