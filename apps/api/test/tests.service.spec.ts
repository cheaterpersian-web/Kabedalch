import { TestsService } from '../src/modules/tests/tests.service';

describe('TestsService scoring', () => {
  it('computes liver grade boundaries', async () => {
    const svc = new TestsService({} as any);
    const test: any = {
      id: 't1',
      type: 'liver',
      questions: [
        { id: 'q1', weight: 1, options: [{ value: 'a', score: 1 }] },
        { id: 'q2', weight: 2, options: [{ value: 'b', score: 2 }] },
      ],
    };
    (svc as any).prisma = { testTemplate: { findUnique: async () => test }, package: { findMany: async () => [] }, testResult: { create: async () => ({ id: 'r1' }) } };
    const resp = await svc.submit('t1', [
      { questionId: 'q1', value: 'a' },
      { questionId: 'q2', value: 'b' },
    ]);
    expect(resp.score).toBe(1 * 1 + 2 * 2);
    expect(typeof resp.grade).toBe('string');
  });
});
