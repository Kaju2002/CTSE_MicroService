import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import type { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  async healthCheck(@Res() res: Response) {
    // Check database connection
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (e) {
      dbStatus = 'disconnected';
    }
    const healthcheck = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      database: dbStatus,
      status: dbStatus === 'connected' ? 'OK' : 'UNHEALTHY',
    };
    if (dbStatus === 'connected') {
      return res.status(200).json(healthcheck);
    } else {
      return res.status(503).json(healthcheck);
    }
  }
}
