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
    // Seed minimal templates if database is empty (first-run safety)
    await this.prisma.testTemplate.upsert({
      where: { id: 'liver-template' },
      create: {
        id: 'liver-template',
        type: 'liver' as any,
        name: 'تست کبد چرب',
        questions: [
          { id: 'q1', text: 'احساس خستگی دارید؟', type: 'single', weight: 1, options: [
            { value: 'هرگز', score: 0 }, { value: 'گاهی', score: 1 }, { value: 'اغلب', score: 2 }
          ]},
          { id: 'q2', text: 'شاخص BMI شما؟', type: 'number', weight: 1.5 },
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
          { id: 'a2', text: 'در یک نوبت چند واحد مصرف می‌کنید؟', type: 'single', weight: 1, options: [
            { value: '۱-۲', score: 0 }, { value: '۳-۴', score: 1 }, { value: '۵-۶', score: 2 }, { value: '۷+', score: 4 }
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
    const tag = `${template.type}:${grade}`;
    const best = packages.find((p: any) => p.tags.includes(tag)) || packages[0];
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
