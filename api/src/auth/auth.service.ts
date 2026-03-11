import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture,
        position: user.position,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profilePicture: true,
        position: true,
        bio: true,
        showInTeam: true,
        linkedin: true,
        twitter: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(newPassword)) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(newPassword)) {
      throw new BadRequestException('Password must contain at least one number');
    }
    if (!/[@$!%*?&]/.test(newPassword)) {
      throw new BadRequestException('Password must contain at least one special character (@$!%*?&)');
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
