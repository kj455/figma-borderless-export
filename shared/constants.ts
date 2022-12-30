import { Scale } from './types';

export const EXTENSION_LIST = ['png', 'jpg'] as const;
export const SCALE_LIST = ['0.5x', '0.75x', '1x', '1.5x', '2x', '3x', '4x'] as const;
export const DEFAULT_SCALE = '1x' satisfies Scale;
