import 'dotenv/config';

export const ObjectStorageConfig = {
  access_key: process.env.OBJECT_STORAGE_KEY_ID,
  secret_key: process.env.OBJECT_STORAGE_SECRET,
  region: process.env.OBJECT_STORAGE_REGION,
  endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
};
