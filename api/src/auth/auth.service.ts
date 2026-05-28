import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailer: MailerService,
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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists
      return { message: 'If this email exists, a reset has been processed.' };
    }

    // Generate a temporary password
    const tempPassword = this.generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await this.mailer.sendSafe({
      from: 'no-reply@assbep.org',
      to: email,
      subject: 'ASSBEP — Password reset',
      message: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
  <div style="background:linear-gradient(135deg,#0ea5e9,#0369a1);padding:24px 28px">
    <h1 style="margin:0;color:#fff;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase">ASSBEP — Password reset</h1>
  </div>
  <div style="padding:24px 28px;color:#0f172a;font-size:15px;line-height:1.7">
    <p style="margin:0 0 12px">Hello ${user.name || ''},</p>
    <p style="margin:0 0 12px">A password reset was requested for your ASSBEP account.</p>
    <p style="margin:0 0 12px">Your temporary password is:</p>
    <p style="margin:0 0 16px;font-family:Menlo,Consolas,monospace;font-size:18px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;letter-spacing:1px"><strong>${tempPassword}</strong></p>
    <p style="margin:0 0 12px">Please log in and change it immediately from your profile.</p>
    <p style="margin:0;color:#64748b;font-size:13px">If you did not request this, please contact us right away.</p>
  </div>
  <div style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;color:#64748b;font-size:12px">— ASSBEP</div>
</div>`,
    });

    return { message: 'If this email exists, a reset has been processed.' };
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const specials = '@$!%*?&';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    password += specials.charAt(Math.floor(Math.random() * specials.length));
    password += 'A1'; // ensure uppercase + number
    return password;
  }
}
