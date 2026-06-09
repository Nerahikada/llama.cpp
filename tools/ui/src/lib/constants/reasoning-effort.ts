import { ReasoningEffort } from '$lib/enums';
import type { ReasoningEffortLevel } from '$lib/types';

/**
 * Reasoning effort UI labels.
 * Keys match the ReasoningEffort enum values for type-safe lookups.
 */
export const REASONING_EFFORT_LABELS: Record<string, string> = {
	[ReasoningEffort.LOW]: '低',
	[ReasoningEffort.MEDIUM]: '中',
	[ReasoningEffort.HIGH]: '高',
	[ReasoningEffort.MAX]: '最大'
};

export const REASONING_EFFORT_LEVELS: ReasoningEffortLevel[] = [
	{ value: 'off', label: 'オフ', isOff: true },
	{ value: ReasoningEffort.LOW, label: '低' },
	{ value: ReasoningEffort.MEDIUM, label: '中' },
	{ value: ReasoningEffort.HIGH, label: '高' },
	{ value: ReasoningEffort.MAX, label: '最大', hasInfo: true }
];
