import { TestsService } from '../src/modules/tests/tests.service';

describe('TestsService scoring', () => {
  it('computes liver grade boundaries', async () => {
    const svc = new TestsService({} as any);
    const test: any = {
      id: 't1',
      type: 'liver',
      questions: [
        { id: 'q1', type: 'single', weight: 1, options: [{ value: 'a', score: 1 }] },
        { id: 'q2', type: 'single', weight: 2, options: [{ value: 'b', score: 2 }] },
      ],
    };
    (svc as any).prisma = { 
      testTemplate: { findUnique: async () => test }, 
      package: { findMany: async () => [], findUnique: async () => ({ id: 'p1', title: 'Test Package' }) }, 
      testResult: { create: async () => ({ id: 'r1' }) } 
    };
    const resp = await svc.submit('t1', {
      answers: {
        'q1': 'a',
        'q2': 'b'
      }
    });
    expect(resp.score).toBe(5); // (1 * 1) + (2 * 2) = 5
    expect(typeof resp.grade).toBe('string');
  });
});
