import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export const uploadFileToS3 = async (file: Express.Multer.File, key: string) => {
  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  await s3.send(uploadCommand);
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const uploadUserProfilePicture = async (file: Express.Multer.File, userId: string) => {
  const key = `users/${userId}/profile-${Date.now()}-${file.originalname}`;
  return await uploadFileToS3(file, key);
};

export const uploadProductImage = async (file: Express.Multer.File, productId: string) => {
  const key = `products/${productId}/image-${Date.now()}-${file.originalname}`;
  return await uploadFileToS3(file, key);
};

export const deleteFileFromS3 = async (key: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  await s3.send(deleteCommand);
};

export const getSignedUrlFromS3 = async (key: string) => {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  };