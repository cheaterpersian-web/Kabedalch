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
        tags: ['کبد', 'پایه', 'liver:نرمال', 'liver:خفیف'],
      },
      {
        title: 'پکیج درمان ترک الکل - مشاوره و پیگیری',
        description: '۸ جلسه مشاوره تخصصی + پیگیری',
        priceIRR: 8900000,
        durationDays: 60,
        features: { consult: 8, followup: true },
        tags: ['الکل', 'مشاوره', 'alcohol:خطر متوسط', 'alcohol:نیاز به ارزیابی تخصصی'],
      },
      {
        title: 'پکیج VIP 3 ماهه',
        description: 'برنامه ۹۰ روزه VIP با پشتیبانی ویژه',
        priceIRR: 19900000,
        durationDays: 90,
        features: { videos: true, consult: 6, diet: true, vip: true },
        tags: ['VIP', 'liver:شدید', 'alcohol:نیاز به ارزیابی تخصصی'],
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
        { id: 'q1', text: 'در یک ماه گذشته، چند بار احساس خستگی مفرط داشته‌اید؟', type: 'single', weight: 1, options: [
          { value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }
        ]},
        { id: 'q2', text: 'شاخص BMI شما؟', type: 'number', weight: 1.5 },
        { id: 'q3', text: 'درد یا سنگینی در سمت راست شکم (ناحیه کبد) دارید؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'خفیف', score: 1 }, { value: 'شدید', score: 2 }
        ]},
        { id: 'q4', text: 'مصرف قند و شیرینی روزانه', type: 'single', weight: 1, options: [
          { value: 'کم', score: 0 }, { value: 'متوسط', score: 1 }, { value: 'زیاد', score: 2 }
        ]},
        { id: 'q5', text: 'مصرف نوشیدنی‌های قندی (نوشابه/انرژی‌زا)', type: 'single', weight: 1, options: [
          { value: 'ندارم', score: 0 }, { value: 'هفتگی', score: 1 }, { value: 'روزانه', score: 2 }
        ]},
        { id: 'q6', text: 'فعالیت بدنی هفتگی', type: 'single', weight: 1, options: [
          { value: 'بالا', score: 0 }, { value: 'متوسط', score: 1 }, { value: 'کم', score: 2 }
        ]},
        { id: 'q7', text: 'آزمایشات اخیر: تری‌گلیسرید بالا؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'مرزی', score: 1 }, { value: 'بالا', score: 2 }
        ]},
        { id: 'q8', text: 'آزمایشات اخیر: ALT/AST بالا؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'خفیف', score: 1 }, { value: 'بالا', score: 2 }
        ]},
        { id: 'q9', text: 'سابقه دیابت یا پیش‌دیابت', type: 'single', weight: 1.5, options: [
          { value: 'خیر', score: 0 }, { value: 'پیش‌دیابت', score: 1 }, { value: 'دیابت', score: 2 }
        ]},
        { id: 'q10', text: 'سابقه مصرف الکل', type: 'single', weight: 2, options: [
          { value: 'ندارم', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'زیاد', score: 3 }
        ]},
        { id: 'q11', text: 'دور کمر (سانتی‌متر)', type: 'number', weight: 1.5 },
        { id: 'q12', text: 'مصرف غذاهای سرخ‌کردنی/فست‌فود', type: 'single', weight: 1, options: [
          { value: 'کم', score: 0 }, { value: 'متوسط', score: 1 }, { value: 'زیاد', score: 2 }
        ]},
        { id: 'q13', text: 'کیفیت خواب (خر و پف/وقفه تنفسی)', type: 'single', weight: 1, options: [
          { value: 'طبیعی', score: 0 }, { value: 'مختل', score: 2 }
        ]},
        { id: 'q14', text: 'سونوگرافی/تصویربرداری: شواهد کبد چرب', type: 'single', weight: 2, options: [
          { value: 'ندارد', score: 0 }, { value: 'گرید ۱', score: 1 }, { value: 'گرید ۲-۳', score: 3 }
        ]},
        { id: 'q15', text: 'سابقه خانوادگی کبد چرب/سندروم متابولیک', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 1 }
        ]},
      ],
      scoringLogic: { liver: [
        { max: 4, grade: 'نرمال' },
        { max: 9, grade: 'خفیف (grade 1)' },
        { max: 14, grade: 'متوسط (grade 2)' },
        { max: 999, grade: 'شدید (grade 3)' }
      ]},
    },
    update: {
      name: 'تست کبد چرب',
      type: TestType.liver,
      questions: [
        { id: 'q1', text: 'در یک ماه گذشته، چند بار احساس خستگی مفرط داشته‌اید؟', type: 'single', weight: 1, options: [
          { value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }
        ]},
        { id: 'q2', text: 'شاخص BMI شما؟', type: 'number', weight: 1.5 },
        { id: 'q3', text: 'درد یا سنگینی در سمت راست شکم (ناحیه کبد) دارید؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'خفیف', score: 1 }, { value: 'شدید', score: 2 }
        ]},
        { id: 'q4', text: 'مصرف قند و شیرینی روزانه', type: 'single', weight: 1, options: [
          { value: 'کم', score: 0 }, { value: 'متوسط', score: 1 }, { value: 'زیاد', score: 2 }
        ]},
        { id: 'q5', text: 'مصرف نوشیدنی‌های قندی (نوشابه/انرژی‌زا)', type: 'single', weight: 1, options: [
          { value: 'ندارم', score: 0 }, { value: 'هفتگی', score: 1 }, { value: 'روزانه', score: 2 }
        ]},
        { id: 'q6', text: 'فعالیت بدنی هفتگی', type: 'single', weight: 1, options: [
          { value: 'بالا', score: 0 }, { value: 'متوسط', score: 1 }, { value: 'کم', score: 2 }
        ]},
        { id: 'q7', text: 'آزمایشات اخیر: تری‌گلیسرید بالا؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'مرزی', score: 1 }, { value: 'بالا', score: 2 }
        ]},
        { id: 'q8', text: 'آزمایشات اخیر: ALT/AST بالا؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'خفیف', score: 1 }, { value: 'بالا', score: 2 }
        ]},
        { id: 'q9', text: 'سابقه دیابت یا پیش‌دیابت', type: 'single', weight: 1.5, options: [
          { value: 'خیر', score: 0 }, { value: 'پیش‌دیابت', score: 1 }, { value: 'دیابت', score: 2 }
        ]},
        { id: 'q10', text: 'سابقه مصرف الکل', type: 'single', weight: 2, options: [
          { value: 'ندارم', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'زیاد', score: 3 }
        ]},
        { id: 'q11', text: 'دور کمر (سانتی‌متر)', type: 'number', weight: 1.5 },
        { id: 'q12', text: 'مصرف غذاهای سرخ‌کردنی/فست‌فود', type: 'single', weight: 1, options: [
          { value: 'کم', score: 0 }, { value: 'متوسط', score: 1 }, { value: 'زیاد', score: 2 }
        ]},
        { id: 'q13', text: 'کیفیت خواب (خر و پف/وقفه تنفسی)', type: 'single', weight: 1, options: [
          { value: 'طبیعی', score: 0 }, { value: 'مختل', score: 2 }
        ]},
        { id: 'q14', text: 'سونوگرافی/تصویربرداری: شواهد کبد چرب', type: 'single', weight: 2, options: [
          { value: 'ندارد', score: 0 }, { value: 'گرید ۱', score: 1 }, { value: 'گرید ۲-۳', score: 3 }
        ]},
        { id: 'q15', text: 'سابقه خانوادگی کبد چرب/سندروم متابولیک', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 1 }
        ]},
      ],
      scoringLogic: { liver: [
        { max: 4, grade: 'نرمال' },
        { max: 9, grade: 'خفیف (grade 1)' },
        { max: 14, grade: 'متوسط (grade 2)' },
        { max: 999, grade: 'شدید (grade 3)' }
      ]},
    },
  });

  const alcoholTest = await prisma.testTemplate.upsert({
    where: { id: 'alcohol-template' },
    create: {
      id: 'alcohol-template',
      type: TestType.alcohol,
      name: 'تست سنجش اعتیاد به الکل',
      questions: [
        { id: 'a1', text: 'چند وقت یکبار الکل مصرف می‌کنید؟', type: 'single', weight: 1, options: [
          { value: 'هرگز', score: 0 }, { value: 'ماهانه', score: 1 }, { value: 'هفتگی', score: 2 }, { value: 'روزانه', score: 4 }
        ]},
        { id: 'a2', text: 'در یک نوبت معمولاً چند سی‌سی مصرف می‌کنید؟', type: 'single', weight: 1, options: [
          { value: '۵۰ سی‌سی', score: 0 }, { value: '۱۰۰ سی‌سی', score: 1 }, { value: '۱۵۰ سی‌سی', score: 2 }, { value: '۲۰۰+ سی‌سی', score: 4 }
        ]},
        { id: 'a3', text: 'آیا برای شروع روز نیاز به مصرف دارید؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a4', text: 'کنترل مصرف برایتان دشوار است؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a5', text: 'آیا به شما توصیه شده مصرف را کم/قطع کنید؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 2 }
        ]},
        { id: 'a6', text: 'تداخل با کار/خانواده به دلیل مصرف', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a7', text: 'علائم ترک (لرزش، تعریق، اضطراب)', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'خفیف', score: 2 }, { value: 'شدید', score: 4 }
        ]},
        { id: 'a8', text: 'مصرف برای مقابله با استرس', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 3 }
        ]},
        { id: 'a9', text: 'سابقه تلاش برای ترک', type: 'single', weight: 1, options: [
          { value: 'نداشته‌ام', score: 0 }, { value: '۱-۲ بار', score: 1 }, { value: '۳+ بار', score: 2 }
        ]},
        { id: 'a10', text: 'سابقه خانوادگی وابستگی به الکل', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 2 }
        ]},
        { id: 'a11', text: 'احساس گناه یا پشیمانی پس از مصرف', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 3 }
        ]},
        { id: 'a12', text: 'از دست دادن هوشیاری/فراموشی وقایع (blackout)', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a13', text: 'صدمه به خود یا دیگران در اثر مصرف', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 3 }
        ]},
        { id: 'a14', text: 'تلاش برای کاهش مصرف در ۳ ماه اخیر', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله، موفق', score: 1 }, { value: 'بله، ناموفق', score: 2 }
        ]},
        { id: 'a15', text: 'ابراز نگرانی اطرافیان درباره مصرف شما', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 2 }
        ]},
      ],
      scoringLogic: { alcohol: [
        { max: 7, grade: 'کم‌خطر' },
        { max: 15, grade: 'خطر متوسط' },
        { max: 999, grade: 'نیاز به ارزیابی تخصصی' }
      ]},
    },
    update: {
      name: 'تست سنجش اعتیاد به الکل',
      type: TestType.alcohol,
      questions: [
        { id: 'a1', text: 'چند وقت یکبار الکل مصرف می‌کنید؟', type: 'single', weight: 1, options: [
          { value: 'هرگز', score: 0 }, { value: 'ماهانه', score: 1 }, { value: 'هفتگی', score: 2 }, { value: 'روزانه', score: 4 }
        ]},
        { id: 'a2', text: 'در یک نوبت معمولاً چند سی‌سی مصرف می‌کنید؟', type: 'single', weight: 1, options: [
          { value: '۵۰ سی‌سی', score: 0 }, { value: '۱۰۰ سی‌سی', score: 1 }, { value: '۱۵۰ سی‌سی', score: 2 }, { value: '۲۰۰+ سی‌سی', score: 4 }
        ]},
        { id: 'a3', text: 'آیا برای شروع روز نیاز به مصرف دارید؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a4', text: 'کنترل مصرف برایتان دشوار است؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a5', text: 'آیا به شما توصیه شده مصرف را کم/قطع کنید؟', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 2 }
        ]},
        { id: 'a6', text: 'تداخل با کار/خانواده به دلیل مصرف', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a7', text: 'علائم ترک (لرزش، تعریق، اضطراب)', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'خفیف', score: 2 }, { value: 'شدید', score: 4 }
        ]},
        { id: 'a8', text: 'مصرف برای مقابله با استرس', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 3 }
        ]},
        { id: 'a9', text: 'سابقه تلاش برای ترک', type: 'single', weight: 1, options: [
          { value: 'نداشته‌ام', score: 0 }, { value: '۱-۲ بار', score: 1 }, { value: '۳+ بار', score: 2 }
        ]},
        { id: 'a10', text: 'سابقه خانوادگی وابستگی به الکل', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 2 }
        ]},
        { id: 'a11', text: 'احساس گناه یا پشیمانی پس از مصرف', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 3 }
        ]},
        { id: 'a12', text: 'از دست دادن هوشیاری/فراموشی وقایع (blackout)', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'گاهی', score: 2 }, { value: 'بله', score: 4 }
        ]},
        { id: 'a13', text: 'صدمه به خود یا دیگران در اثر مصرف', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 3 }
        ]},
        { id: 'a14', text: 'تلاش برای کاهش مصرف در ۳ ماه اخیر', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله، موفق', score: 1 }, { value: 'بله، ناموفق', score: 2 }
        ]},
        { id: 'a15', text: 'ابراز نگرانی اطرافیان درباره مصرف شما', type: 'single', weight: 1, options: [
          { value: 'خیر', score: 0 }, { value: 'بله', score: 2 }
        ]},
      ],
      scoringLogic: { alcohol: [
        { max: 7, grade: 'کم‌خطر' },
        { max: 15, grade: 'خطر متوسط' },
        { max: 999, grade: 'نیاز به ارزیابی تخصصی' }
      ]},
    },
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
