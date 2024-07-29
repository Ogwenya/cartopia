import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  // ********************
  // UPLOAD SINGLE FILE
  // ********************
  uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // ***********************
  // UPLOAD MULTIPLE FILES
  // ***********************
  async upload_multiple_files(
    files: Array<Express.Multer.File>,
    folder: string,
  ) {
    let result = [];
    for (var i = 0; i < files.length; i++) {
      let uploaded_file = await this.uploadFile(files[i], folder);

      result.push({
        image_url: uploaded_file.secure_url,
        public_id: uploaded_file.public_id,
      });
    }
    return result;
  }

  // ************
  // DELETE FILE
  // ************
  async deleteFile(public_id: string) {
    const file = await cloudinary.uploader.destroy(public_id);

    return file;
  }
}
