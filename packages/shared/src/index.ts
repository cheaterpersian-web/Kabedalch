export type UserRole = 'user' | 'admin' | 'consultant';

export type TestType = 'liver' | 'alcohol';

export interface TestQuestionOption {
  value: string;
  score: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  type: 'single' | 'multi' | 'number';
  weight: number;
  options?: TestQuestionOption[];
}

export interface TestTemplate {
  id: string;
  type: TestType;
  name: string;
  questions: TestQuestion[];
  scoringLogic: Record<string, unknown>;
}
