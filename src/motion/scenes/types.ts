import type { Level } from '../MotionPolicy';

export type SceneProps = { level: Level };

/** Depth multiplier per policy level. Reduced removes spatial travel entirely. */
export const amplitudeFor = (level: Level) => (level === 'full' ? 1 : level === 'balanced' ? 0.55 : 0);
