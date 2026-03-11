import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profilePicture: true,
        position: true,
        showInTeam: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTeamMembers() {
    return this.prisma.user.findMany({
      where: { showInTeam: true },
      select: {
        id: true,
        name: true,
        position: true,
        bio: true,
        profilePicture: true,
        linkedin: true,
        twitter: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: { email: string; password: string; name: string; role?: any }) {
    const hashed = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        role: data.role || 'EDITOR',
      },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profilePicture !== undefined) updateData.profilePicture = data.profilePicture;
    if (data.showInTeam !== undefined) updateData.showInTeam = data.showInTeam;
    if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
    if (data.twitter !== undefined) updateData.twitter = data.twitter;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 12);

    return this.prisma.user.update({
      where: { id },
      data: updateData,
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
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
