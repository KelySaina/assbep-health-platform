import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@assbep.org' },
    update: {},
    create: {
      email: 'admin@assbep.org',
      password: hashedPassword,
      name: 'Dr. Jean Kamga',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create programs
  const programs = [
    { slug: 'maternal-health', category: 'maternal', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600', order: 1, published: true, translations: [{ language: 'en', title: 'Maternal Health Program', description: 'Comprehensive prenatal and postnatal care for mothers and newborns in underserved communities.' }, { language: 'fr', title: 'Programme de Santé Maternelle', description: 'Soins prénataux et postnataux complets pour les mères et les nouveau-nés dans les communautés défavorisées.' }] },
    { slug: 'community-vaccination', category: 'vaccination', image: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=600', order: 2, published: true, translations: [{ language: 'en', title: 'Community Vaccination Drives', description: 'Mobile vaccination clinics reaching remote villages to ensure every child is protected.' }, { language: 'fr', title: 'Campagnes de Vaccination Communautaires', description: 'Cliniques de vaccination mobiles atteignant les villages reculés pour protéger chaque enfant.' }] },
    { slug: 'nutrition-awareness', category: 'nutrition', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600', order: 3, published: true, translations: [{ language: 'en', title: 'Nutrition Awareness Campaign', description: 'Educational programs teaching families about balanced nutrition and food security.' }, { language: 'fr', title: 'Campagne de Sensibilisation à la Nutrition', description: 'Programmes éducatifs enseignant aux familles la nutrition équilibrée et la sécurité alimentaire.' }] },
    { slug: 'community-wellness', category: 'wellness', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', order: 4, published: true, translations: [{ language: 'en', title: 'Community Wellness Center', description: 'Free health screenings, fitness classes, and mental health support for all ages.' }, { language: 'fr', title: 'Centre de Bien-être Communautaire', description: 'Dépistages de santé gratuits, cours de fitness et soutien en santé mentale pour tous les âges.' }] },
    { slug: 'health-outreach', category: 'outreach', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600', order: 5, published: true, translations: [{ language: 'en', title: 'Rural Health Outreach', description: 'Bringing essential healthcare services to remote and underserved rural populations.' }, { language: 'fr', title: 'Sensibilisation en Santé Rurale', description: 'Apporter des services de santé essentiels aux populations rurales isolées.' }] },
  ];

  for (const p of programs) {
    const { translations, ...programData } = p;
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...programData,
        translations: { create: translations },
      },
    });
  }
  console.log(`✅ ${programs.length} programs seeded`);

  // Create articles
  const articles = [
    { slug: 'improving-maternal-health', category: 'community_news', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600', authorId: admin.id, published: true, publishedAt: new Date('2026-03-01'), translations: [{ language: 'en', title: 'Improving Maternal Health in Rural Communities', excerpt: 'Our latest initiative has reached over 5,000 mothers in remote villages.', content: '<p>Our maternal health program has made significant strides in improving healthcare access for mothers in rural communities...</p>' }, { language: 'fr', title: 'Améliorer la Santé Maternelle dans les Communautés Rurales', excerpt: 'Notre dernière initiative a atteint plus de 5 000 mères dans les villages reculés.', content: '<p>Notre programme de santé maternelle a fait des progrès significatifs dans l\'amélioration de l\'accès aux soins de santé pour les mères...</p>' }] },
    { slug: 'vaccination-drive-milestone', category: 'community_news', image: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=600', authorId: admin.id, published: true, publishedAt: new Date('2026-02-20'), translations: [{ language: 'en', title: 'Vaccination Drive Reaches New Milestone', excerpt: 'We have successfully vaccinated 10,000 children in the past year.', content: '<p>Our community vaccination program has achieved a remarkable milestone by reaching 10,000 children...</p>' }, { language: 'fr', title: 'La Campagne de Vaccination Atteint un Nouveau Jalon', excerpt: 'Nous avons vacciné avec succès 10 000 enfants au cours de la dernière année.', content: '<p>Notre programme de vaccination communautaire a atteint un jalon remarquable en touchant 10 000 enfants...</p>' }] },
    { slug: '5-tips-healthy-eating', category: 'health_tips', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600', authorId: admin.id, published: true, publishedAt: new Date('2026-02-15'), translations: [{ language: 'en', title: '5 Tips for Healthy Eating on a Budget', excerpt: 'Practical advice for families looking to improve their nutrition affordably.', content: '<p>Eating healthy does not have to be expensive. Here are our top 5 tips...</p>' }, { language: 'fr', title: '5 Conseils pour une Alimentation Saine à Petit Budget', excerpt: 'Conseils pratiques pour les familles souhaitant améliorer leur nutrition à moindre coût.', content: '<p>Manger sainement ne doit pas être cher. Voici nos 5 meilleurs conseils...</p>' }] },
  ];

  for (const a of articles) {
    const { translations, ...articleData } = a;
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        ...articleData,
        translations: { create: translations },
      },
    });
  }
  console.log(`✅ ${articles.length} articles seeded`);

  // Create partners
  const partners = [
    { name: 'World Health Organization', logo: 'https://via.placeholder.com/200x80?text=WHO', website: 'https://who.int', order: 1 },
    { name: 'UNICEF', logo: 'https://via.placeholder.com/200x80?text=UNICEF', website: 'https://unicef.org', order: 2 },
    { name: 'Red Cross', logo: 'https://via.placeholder.com/200x80?text=Red+Cross', website: 'https://redcross.org', order: 3 },
    { name: 'Ministry of Health', logo: 'https://via.placeholder.com/200x80?text=MoH', website: '#', order: 4 },
    { name: 'Community Foundation', logo: 'https://via.placeholder.com/200x80?text=CF', website: '#', order: 5 },
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }
  console.log(`✅ ${partners.length} partners seeded`);

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'ASSBEP Health Platform' },
    { key: 'site_description', value: 'Improving Community Health Together' },
    { key: 'contact_address', value: 'Yaoundé, Cameroon' },
    { key: 'contact_phone', value: '+237 6XX XXX XXX' },
    { key: 'contact_email', value: 'contact@assbep.org' },
    { key: 'office_hours', value: 'Mon-Fri 8:00 AM - 5:00 PM' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✅ ${settings.length} settings seeded`);

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
