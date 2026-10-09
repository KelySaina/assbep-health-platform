import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Minio from 'minio';

@Injectable()
export class MediaService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private prisma: PrismaService) {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = parseInt(process.env.MINIO_PORT || '9000');
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
    this.bucketName = process.env.MINIO_BUCKET || 'assbep-media';

    // Public URL for generating file URLs (supports CDN, proxy, or direct MinIO)
    this.publicUrl = process.env.MINIO_PUBLIC_URL || `http://${endpoint}:${port}`;

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

      const url = `${this.publicUrl}/${this.bucketName}/${fileName}`;

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
    // Pick the fields that may be edited rather than forwarding the body. The
    // previous version handed `data` straight to Prisma, so a caller could also
    // rewrite id, url, size or createdAt — and `url` in particular is what every
    // article and programme references by value, so changing it here would orphan
    // them silently.
    const patch: Record<string, unknown> = {};
    if (typeof data?.altText === 'string') patch.altText = data.altText;
    if (typeof data?.type === 'string') patch.type = data.type;
    if (typeof data?.filename === 'string') patch.filename = data.filename;

    // Framing. Clamped rather than rejected: these arrive from a click on an
    // image, so a value slightly outside the box is a rounding artefact, not an
    // error worth failing a save over. Anything unparseable is ignored, which
    // leaves the stored value alone instead of resetting it to the centre.
    const focalX = MediaService.toPercent(data?.focalX);
    const focalY = MediaService.toPercent(data?.focalY);
    if (focalX !== null) patch.focalX = focalX;
    if (focalY !== null) patch.focalY = focalY;

    return this.prisma.media.update({ where: { id }, data: patch });
  }

  private static toPercent(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return Math.min(100, Math.max(0, n));
  }

  async remove(id: string) {
    // TODO: Also delete from MinIO
    return this.prisma.media.delete({ where: { id } });
  }
}
