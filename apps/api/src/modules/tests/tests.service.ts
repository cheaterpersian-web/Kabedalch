import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

interface SubmitPayload {
  answers: Record<string, any>;
}

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async listTemplates() {
    const existing = await this.prisma.testTemplate.findMany({ orderBy: { createdAt: 'desc' } });
    if (existing.length > 0) {
      // Normalize legacy English option values to Persian in-place (one-time fix)
      for (const t of existing) {
        const qs: any[] = (t as any).questions || [];
        let changed = false;
        const mapped = qs.map((q: any) => {
          if (!q?.options) return q;
          const opts = (q.options || []).map((o: any) => {
            let v = o.value;
            // common
            if (v === 'never') v = 'هرگز';
            if (v === 'sometimes') v = 'گاهی';
            if (v === 'often') v = 'اغلب';
            if (v === 'no') v = 'خیر';
            if (v === 'light') v = 'خفیف';
            if (v === 'heavy') v = 'زیاد';
            if (v === 'monthly') v = 'ماهانه';
            if (v === 'weekly') v = 'هفتگی';
            if (v === 'daily') v = 'روزانه';
            if (v === '1-2') v = '۱-۲';
            if (v === '3-4') v = '۳-۴';
            if (v === '5-6') v = '۵-۶';
            if (v === '7+') v = '۷+';
            if (v !== o.value) changed = true;
            return { ...o, value: v };
          });
          return { ...q, options: opts };
        });
        if (changed) {
          await this.prisma.testTemplate.update({ where: { id: t.id }, data: { questions: mapped } });
        }
      }
      return this.prisma.testTemplate.findMany({ orderBy: { createdAt: 'desc' } });
    }
    // Seed full templates if database is empty (first-run safety)
    await this.prisma.testTemplate.upsert({
      where: { id: 'liver-template' },
      create: {
        id: 'liver-template',
        type: 'liver' as any,
        name: 'تست کبد چرب',
        questions: [
          { id: 'q1', text: 'در یک ماه گذشته، چند بار احساس خستگی مفرط داشته‌اید؟', type: 'single', weight: 1, options: [
            { value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }
          ]},
          { id: 'q2a', text: 'وزن شما (کیلوگرم)', type: 'number', weight: 0.8 },
          { id: 'q2b', text: 'قد شما (سانتی‌متر)', type: 'number', weight: 0.7 },
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
            { value: 'خیر', score: 0 }, { value: 'مرزی', score: 1 }, { value: 'بالا', score: 2 }, { value: 'آزمایش نداده‌ام', score: 0 }
          ]},
          { id: 'q8', text: 'آزمایشات اخیر: ALT/AST بالا؟', type: 'single', weight: 1, options: [
            { value: 'خیر', score: 0 }, { value: 'خفیف', score: 1 }, { value: 'بالا', score: 2 }, { value: 'آزمایش نداده‌ام', score: 0 }
          ]},
          { id: 'q9', text: 'سابقه دیابت یا پیش‌دیابت', type: 'single', weight: 1.5, options: [
            { value: 'خیر', score: 0 }, { value: 'پیش‌دیابت', score: 1 }, { value: 'دیابت', score: 2 }
          ]},
          { id: 'q10', text: 'سابقه مصرف الکل', type: 'single', weight: 2, options: [
            { value: 'ندارم', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'زیاد', score: 3 }
          ]},
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
      update: {},
    });
    await this.prisma.testTemplate.upsert({
      where: { id: 'alcohol-template' },
      create: {
        id: 'alcohol-template',
        type: 'alcohol' as any,
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
      update: {},
    });

    // Ensure some packages exist for recommendations
    const anyPkg = await this.prisma.package.findFirst();
    if (!anyPkg) {
      await this.prisma.package.createMany({
        data: [
          {
            title: 'پکیج پایه بازسازی کبد',
            description: 'برنامه ۳۰ روزه همراه ویدیو و رژیم اختصاصی',
            priceIRR: 4900000,
            durationDays: 30,
            features: { videos: true, consult: 1, diet: true } as any,
            tags: ['liver:نرمال', 'liver:خفیف'],
          },
          {
            title: 'پکیج درمان ترک الکل - مشاوره و پیگیری',
            description: '۸ جلسه مشاوره تخصصی + پیگیری',
            priceIRR: 8900000,
            durationDays: 60,
            features: { consult: 8, followup: true } as any,
            tags: ['alcohol:کم‌خطر', 'alcohol:خطر متوسط', 'alcohol:پرخطر'],
          },
        ],
        skipDuplicates: true,
      });
    }

    return this.prisma.testTemplate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findTemplateOrFirst(id: string) {
    const tpl = await this.prisma.testTemplate.findUnique({ where: { id } });
    if (tpl) return tpl;

    // Ensure templates exist (seed on first access if DB is empty)
    const anyExisting = await this.prisma.testTemplate.findFirst();
    if (!anyExisting) {
      // listTemplates performs one-time normalization and seeds defaults when empty
      await this.listTemplates();
    }

    const first = await this.prisma.testTemplate.findFirst({ orderBy: { createdAt: 'asc' } });
    return first;
  }

  async submit(testId: string, payload: SubmitPayload, userId?: string) {
    const template = await this.prisma.testTemplate.findUnique({ where: { id: testId } });
    if (!template) throw new Error('Test not found');

    // Simplified scoring logic: expect questions with options having score and weight
    const questions: any[] = (template.questions as any) || [];
    const weights: Record<string, number> = {};
    for (const q of questions) weights[q.id] = q.weight ?? 1;

    let score = 0;
    for (const q of questions) {
      const ans = payload.answers[q.id];
      if (ans == null) continue;
      if (q.type === 'number') {
        score += (Number(ans) || 0) * (q.weight || 1);
      } else if (q.type === 'single') {
        const opt = (q.options || []).find((o: any) => o.value === ans);
        if (opt) score += (opt.score || 0) * (q.weight || 1);
      } else if (q.type === 'multi') {
        const arr: string[] = Array.isArray(ans) ? ans : [ans];
        for (const v of arr) {
          const opt = (q.options || []).find((o: any) => o.value === v);
          if (opt) score += (opt.score || 0) * (q.weight || 1);
        }
      }
    }

    let grade = 'نامشخص';
    if (template.type === 'liver') {
      if (score <= 4) grade = 'Grade 0 (نرمال)';
      else if (score <= 9) grade = 'Grade 1 (خفیف)';
      else if (score <= 14) grade = 'Grade 2 (متوسط)';
      else grade = 'Grade 3 (شدید)';
    } else if (template.type === 'alcohol') {
      if (score <= 7) grade = 'کم‌خطر';
      else if (score <= 15) grade = 'خطر متوسط';
      else grade = 'پرخطر';
    }

    // Simple mapping: choose first matching package by tag
    let recommendedPackageId: string | undefined;
    const packages = await this.prisma.package.findMany();
    // Match tags loosely: accept either exact grade label or simplified variants
    const tagCandidates = [
      `${template.type}:${grade}`,
      // liver grades simplified
      grade.includes('Grade 0') ? `${template.type}:نرمال` : undefined,
      grade.includes('Grade 1') ? `${template.type}:خفیف` : undefined,
      grade.includes('Grade 2') ? `${template.type}:متوسط` : undefined,
      grade.includes('Grade 3') ? `${template.type}:شدید` : undefined,
    ].filter(Boolean) as string[];
    const best = packages.find((p: any) => (p.tags || []).some((t: string) => tagCandidates.includes(t))) || packages[0];
    if (best) recommendedPackageId = best.id;

    const result = await this.prisma.testResult.create({
      data: {
        userId,
        testId: template.id,
        answers: payload.answers,
        score,
        grade,
        recommendedPackageId,
      },
    });

    const recommended = recommendedPackageId
      ? await this.prisma.package.findUnique({ where: { id: recommendedPackageId } })
      : null;

    return {
      score,
      grade,
      gradeDescription: this.describeGrade(template.type as string, grade),
      recommendedPackages: recommended ? [recommended] : [],
      resultId: result.id,
    };
  }

  resultsForUser(userId: string) {
    return this.prisma.testResult.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  private describeGrade(type: string, grade: string): string {
    if (type === 'liver') {
      if (grade.includes('Grade 0')) return 'نتیجه نرمال است. برای حفظ سلامت کبد، برنامه سبک زندگی و محصولات حمایتی ما را دنبال کنید.';
      if (grade.includes('Grade 1')) return 'کبد چرب گرید ۱ (خفیف). اجرای برنامه تغذیه و استفاده از محصولات حمایتی ما توصیه می‌شود.';
      if (grade.includes('Grade 2')) return 'کبد چرب گرید ۲ (متوسط). از برنامه‌های تخصصی ما برای کاهش چربی کبد بهره بگیرید.';
      if (grade.includes('Grade 3')) return 'کبد چرب گرید ۳ (شدید). پیشنهاد می‌کنیم از بسته‌های کامل بازسازی کبد ما استفاده کنید.';
    }
    if (type === 'alcohol') {
      if (grade.includes('کم‌خطر')) return 'الگوی مصرف کم‌خطر. پرهیز یا محدودسازی بیشتر توصیه می‌شود.';
      if (grade.includes('خطر متوسط')) return 'مصرف در محدوده خطر متوسط. کاهش مصرف و مشاوره تخصصی توصیه می‌شود.';
      if (grade.includes('پرخطر')) return 'مصرف پرخطر. ارزیابی تخصصی و برنامه ترک تحت نظر کارشناس توصیه می‌شود.';
    }
    // Fallback description to avoid empty final answers in edge cases
    return 'نتیجه ارزیابی آماده است. برای دریافت راهنمایی دقیق‌تر، از پکیج‌های پیشنهادی و مشاوره تخصصی استفاده کنید.';
  }
}
