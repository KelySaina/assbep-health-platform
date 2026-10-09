import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { Focal, collectMediaUrls, rewriteMediaUrls } from './media-focal';

/**
 * Stamps every media URL in every response with its current focal point, resolved
 * from the Media row. One findMany per response, only when the response actually
 * carries media URLs — so most endpoints pay nothing. See common/media-focal.ts
 * for why framing is resolved here rather than stored on the content record.
 */
@Injectable()
export class MediaFocalInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (data) => {
        const urls = new Set<string>();
        collectMediaUrls(data, urls);
        if (urls.size === 0) return data;

        const rows = await this.prisma.media.findMany({
          where: { url: { in: [...urls] } },
          select: { url: true, focalX: true, focalY: true },
        });
        const focals = new Map<string, Focal>(
          rows.map((r) => [r.url, { x: r.focalX, y: r.focalY }]),
        );
        return rewriteMediaUrls(data, focals);
      }),
    );
  }
}
