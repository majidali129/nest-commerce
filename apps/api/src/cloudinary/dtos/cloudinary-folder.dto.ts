import { IsIn, IsString } from 'class-validator';
import { CLOUDINARY_FOLDER_KEYS } from '../cloudinary-folders';

export class CloudinaryFolderDto {
  @IsString()
  @IsIn([...CLOUDINARY_FOLDER_KEYS], {
    message: `folderName must be one of: ${CLOUDINARY_FOLDER_KEYS.join(', ')}`,
  })
  folderName!: (typeof CLOUDINARY_FOLDER_KEYS)[number];
}
