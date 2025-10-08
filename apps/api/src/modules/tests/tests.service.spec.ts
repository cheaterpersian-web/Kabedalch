import { TestsService } from './tests.service';
import { PrismaService } from '../common/prisma.service';

describe('TestsService scoring', () => {
  const prisma = new PrismaService();
  const service = new TestsService(prisma);

  it('computes liver grades correctly', async () => {
    // mock template
    jest.spyOn(prisma.testTemplate, 'findUnique').mockResolvedValue({
      id: 't', type: 'liver', name: 'x', questions: [
        { id: 'q1', type: 'single', weight: 1, options: [{ value: 'a', score: 2 }] },
      ], scoringLogic: {}, createdAt: new Date(),
    } as any);
    jest.spyOn(prisma.package, 'findMany').mockResolvedValue([{ id: 'p', tags: [] }] as any);
    jest.spyOn(prisma.package, 'findUnique').mockResolvedValue({ id: 'p', title: 'Test Package' } as any);
    jest.spyOn(prisma.testResult, 'create').mockResolvedValue({ id: 'r' } as any);

    const res = await service.submit('t', { answers: { q1: 'a' } });
    expect(res.score).toBeGreaterThanOrEqual(2);
    expect(['Grade 0 (نرمال)','Grade 1 (خفیف)','Grade 2 (متوسط)','Grade 3 (شدید)']).toContain(res.grade);
  });
});
