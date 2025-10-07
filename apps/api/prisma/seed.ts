import { PrismaClient, TestType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // packages
  const packages = await prisma.package.createMany({
    data: [
      {
        title: 'پکیج پایه بازسازی کبد',
        description: 'برنامه ۳۰ روزه همراه ویدیو و رژیم اختصاصی',
        priceIRR: 4900000,
        durationDays: 30,
        features: { videos: true, consult: 1, diet: true },
        tags: ['کبد', 'پایه'],
      },
      {
        title: 'پکیج درمان ترک الکل - مشاوره و پیگیری',
        description: '۸ جلسه مشاوره تخصصی + پیگیری',
        priceIRR: 8900000,
        durationDays: 60,
        features: { consult: 8, followup: true },
        tags: ['الکل', 'مشاوره'],
      },
      {
        title: 'پکیج VIP 3 ماهه',
        description: 'برنامه ۹۰ روزه VIP با پشتیبانی ویژه',
        priceIRR: 19900000,
        durationDays: 90,
        features: { videos: true, consult: 6, diet: true, vip: true },
        tags: ['VIP'],
      },
    ],
    skipDuplicates: true,
  });

  // tests templates
  const liverTest = await prisma.testTemplate.upsert({
    where: { id: 'liver-template' },
    create: {
      id: 'liver-template',
      type: TestType.liver,
      name: 'تست کبد چرب',
      questions: [
        { id: 'q1', text: 'احساس خستگی دارید؟', type: 'single', weight: 1, options: [
          { value: 'never', score: 0 }, { value: 'sometimes', score: 1 }, { value: 'often', score: 2 }
        ]},
        { id: 'q2', text: 'شاخص BMI شما؟', type: 'number', weight: 1.5 },
        { id: 'q3', text: 'سابقه مصرف الکل؟', type: 'single', weight: 2, options: [
          { value: 'no', score: 0 }, { value: 'light', score: 1 }, { value: 'heavy', score: 3 }
        ]},
        // ... add up to 10
      ],
      scoringLogic: { liver: [
        { max: 4, grade: 'نرمال' },
        { max: 9, grade: 'خفیف (grade 1)' },
        { max: 14, grade: 'متوسط (grade 2)' },
        { max: 999, grade: 'شدید (grade 3)' }
      ]},
    },
    update: {},
  });

  const alcoholTest = await prisma.testTemplate.upsert({
    where: { id: 'alcohol-template' },
    create: {
      id: 'alcohol-template',
      type: TestType.alcohol,
      name: 'تست سنجش اعتیاد به الکل',
      questions: [
        { id: 'a1', text: 'چند وقت یکبار الکل مصرف می‌کنید؟', type: 'single', weight: 1, options: [
          { value: 'never', score: 0 }, { value: 'monthly', score: 1 }, { value: 'weekly', score: 2 }, { value: 'daily', score: 4 }
        ]},
        { id: 'a2', text: 'در یک نوبت چند واحد مصرف می‌کنید؟', type: 'single', weight: 1, options: [
          { value: '1-2', score: 0 }, { value: '3-4', score: 1 }, { value: '5-6', score: 2 }, { value: '7+', score: 4 }
        ]},
        // ... add up to 10
      ],
      scoringLogic: { alcohol: [
        { max: 7, grade: 'کم‌خطر' },
        { max: 15, grade: 'خطر متوسط' },
        { max: 999, grade: 'نیاز به ارزیابی تخصصی' }
      ]},
    },
    update: {},
  });

  // testimonials
  await prisma.testimonial.createMany({
    data: [
      { userName: 'کاربر ۱', phoneMasked: '0916******7261', message: 'واقعاً دوره‌هاتون عالیه، راضیم از نتیجه.' },
      { userName: 'کاربر ۲', phoneMasked: '0935******112', message: 'تو یک ماه تغییرات بدنیم رو دیدم. ممنون از تیم حرفه‌ای.' },
      { userName: 'کاربر ۳', phoneMasked: '0901******334', message: 'مشاوره تلفنی خیلی کمکم کرد، دوباره زندگی گرفتم.' },
    ],
    skipDuplicates: true,
  });

  console.log({ packages, liverTest: liverTest.id, alcoholTest: alcoholTest.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
