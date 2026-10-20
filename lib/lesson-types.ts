import { categories } from './model';
import type { ReferenceId } from './references';

export const lessonLevels = ['Foundation', 'Intermediate', 'Advanced'] as const;
export type LessonLevel = (typeof lessonLevels)[number];
export const lessonCategories = [
  ...categories,
  'Recall & focus',
  'Everyday skills',
  'Scent & enrichment',
  'Cooperative care',
] as const;
export type LessonCategory = (typeof lessonCategories)[number];
export type Step = { title: string; seconds: number; instruction: string; success: string };
export type Lesson = {
  id: string;
  title: string;
  category: LessonCategory;
  level: LessonLevel;
  prerequisites: string[];
  readiness: string;
  subtitle: string;
  objective: string;
  equipment: string[];
  preparation: string;
  safety: string;
  discomfort: string;
  easier: string;
  harder: string;
  reinforcement: string;
  evidence: string;
  sources: ReferenceId[];
  steps: [Step, Step, Step];
};
export const makeStep = (
  title: string,
  seconds: number,
  instruction: string,
  success: string,
): Step => ({ title, seconds, instruction, success });

export const lessonDefaults = {
  level: 'Foundation' as const,
  prerequisites: [] as string[],
  readiness:
    'Choose a quiet setting where your dog is comfortable, their everyday needs are met, and they can freely pause or move away.',
  discomfort:
    'Pause for freezing, turning away, lip licking, tucked tail, panting unrelated to heat, or refusing a normally welcome treat. Look at the whole dog and context.',
  easier:
    'Stop, offer space and rest. Next time, reduce intensity or duration and simplify the task. Increase distance from anything worrying until your dog can choose to participate comfortably.',
  harder:
    'After relaxed success on separate days, change just one small thing. Return to an easier step if comfort changes.',
  reinforcement:
    'Reward each comfortable attempt while learning. Once fluent, vary food rewards gradually and keep praise, choice and useful real-life rewards.',
  evidence:
    'A practical exercise based on reward-based learning and gradual exposure. This branded lesson is not a separately validated clinical protocol.',
};
