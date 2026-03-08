import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Minio from 'minio';

@Injectable()
export class MediaService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private prisma: PrismaService) {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = parseInt(process.env.MINIO_PORT || '9000');
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
    this.bucketName = process.env.MINIO_BUCKET || 'assbep-media';

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });
  }

  async onModuleInit() {
    // Create bucket if it doesn't exist
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');

        // Set bucket policy to allow public read access
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        console.log(`✅ MinIO bucket "${this.bucketName}" created and configured`);
      } else {
        console.log(`✅ MinIO bucket "${this.bucketName}" already exists`);
      }
    } catch (error) {
      console.error('❌ MinIO initialization error:', error);
    }
  }

  async uploadFile(file: Express.Multer.File, altText?: string, type?: string) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const metaData = {
      'Content-Type': file.mimetype,
    };

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        metaData,
      );

      const url = `http://localhost:9000/${this.bucketName}/${fileName}`;

      // Determine type from mimetype if not provided
      let mediaType = type;
      if (!mediaType) {
        if (file.mimetype.startsWith('image/')) mediaType = 'image';
        else if (file.mimetype.startsWith('video/')) mediaType = 'video';
        else if (file.mimetype.includes('pdf')) mediaType = 'document';
        else mediaType = 'document';
      }

      // Save to database
      return this.prisma.media.create({
        data: {
          url,
          altText: altText || file.originalname,
          type: mediaType,
          filename: fileName,
        },
      });
    } catch (error) {
      console.error('MinIO upload error:', error);
      throw error;
    }
  }

  async findAll(type?: string) {
    const where: any = {};
    if (type) where.type = type;
    return this.prisma.media.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.media.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.media.update({ where: { id }, data });
  }

  async remove(id: string) {
    // TODO: Also delete from MinIO
    return this.prisma.media.delete({ where: { id } });
  }
}
