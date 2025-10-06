import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

interface SubmitPayload {
  answers: Record<string, any>;
}

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async listTemplates() {
    return this.prisma.testTemplate.findMany({ orderBy: { createdAt: 'desc' } });
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
      if (score <= 4) grade = 'نرمال';
      else if (score <= 9) grade = 'خفیف';
      else if (score <= 14) grade = 'متوسط';
      else grade = 'شدید';
    } else if (template.type === 'alcohol') {
      if (score <= 7) grade = 'کم‌خطر';
      else if (score <= 15) grade = 'خطر متوسط';
      else grade = 'نیاز به ارزیابی تخصصی';
    }

    // Simple mapping: choose first matching package by tag
    let recommendedPackageId: string | undefined;
    const packages = await this.prisma.package.findMany();
    const tag = `${template.type}:${grade}`;
    const best = packages.find((p) => p.tags.includes(tag)) || packages[0];
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
      recommendedPackages: recommended ? [recommended] : [],
      resultId: result.id,
    };
  }
}
