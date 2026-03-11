import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user only
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@assbep.org' },
    update: {},
    create: {
      email: 'admin@assbep.org',
      password: hashedPassword,
      name: 'System Administrator',
      role: Role.SUPER_ADMIN,
      position: 'Platform Administrator',
      bio: 'Manages the ASSBEP health platform and coordinates team operations.',
      showInTeam: false,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
