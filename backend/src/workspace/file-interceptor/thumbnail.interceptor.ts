import 'dotenv/config';
import * as AWS from 'aws-sdk';
import { FileInterceptor } from '@nestjs/platform-express';
import * as MulterS3 from 'multer-s3';

const ObjectStorageConfig = {
  access_key: process.env.OBJECT_STORAGE_KEY_ID,
  secret_key: process.env.OBJECT_STORAGE_SECRET,
  region: process.env.OBJECT_STORAGE_REGION,
  endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
  bucket: process.env.OBJECT_STORAGE_BUCKET,
};

const s3 = new AWS.S3({
  endpoint: ObjectStorageConfig.endpoint,
  region: ObjectStorageConfig.region,
  credentials: {
    accessKeyId: ObjectStorageConfig.access_key,
    secretAccessKey: ObjectStorageConfig.secret_key,
  },
});

export const ThumbnailInterceptor = FileInterceptor('file', {
  storage: new MulterS3({
    s3: s3,
    bucket: ObjectStorageConfig.bucket,
    acl: 'public-read',
    key: function (request, file, cb) {
      cb(null, `thumbnail/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: {},
});
