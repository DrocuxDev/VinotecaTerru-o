import { useId } from 'react';

/**
 * Provisional geometric specimen used only by the phase C laboratory.
 * It is not product imagery and must never be presented as a catalog wine.
 */
export type SpecimenTone = { glass: string; capsule: string; label: string };
export const specimenTones: SpecimenTone[] = [
  { glass: '#2a2f24', capsule: '#7b223b', label: '#e2d4bd' },
  { glass: '#4a4430', capsule: '#c7a15a', label: '#efe6d3' },
  { glass: '#5a3540', capsule: '#9a5a62', label: '#f2e9da' },
];

/** Bottle only, transparent background, so it can live on its own depth plane. */
export function SpecimenBottle({ tone = specimenTones[0], className = '' }: { tone?: SpecimenTone; className?: string }) {
  const id = useId();
  return <svg className={className} viewBox="200 120 200 600" fill="none" aria-hidden="true" focusable="false">
    <defs><linearGradient id={`${id}g`} x1="214" x2="386" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop stopColor="#111" stopOpacity=".55" /><stop offset=".3" stopColor={tone.glass} /><stop offset=".62" stopColor={tone.glass} stopOpacity=".8" /><stop offset="1" stopColor="#0c0c0c" />
    </linearGradient></defs>
    <path d="M271 137h58v155c0 40 57 54 57 104v280q0 24-24 24H238q-24 0-24-24V396c0-50 57-64 57-104Z" fill={`url(#${id}g)`} stroke="#71674d" />
    <rect x="269" y="129" width="62" height="83" rx="3" fill={tone.capsule} />
    <path d="M278 140h44M278 200h44" stroke="#c7a15a" />
    <rect x="226" y="440" width="148" height="150" fill={tone.label} />
    <rect x="234" y="448" width="132" height="134" stroke="#99815a" />
    <path d="M258 523c16-40 68-40 84 0M258 523h84M300 490v65M277 545h46" stroke={tone.capsule} strokeWidth="2" />
    <path d="M232 400v276" stroke="#c7a15a" opacity=".25" strokeWidth="3" />
  </svg>;
}

/** Ambient arch plane (background layer of the hero study). */
export function SpecimenArch({ className = '' }: { className?: string }) {
  const id = useId();
  return <svg className={className} viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
    <defs><radialGradient id={`${id}a`} cx="50%" cy="45%" r="65%"><stop stopColor="#493136" /><stop offset="1" stopColor="#191316" /></radialGradient></defs>
    <rect width="600" height="800" fill={`url(#${id}a)`} />
    <path d="M80 690V280a220 220 0 0 1 440 0v410" stroke="#51434a" />
    <path d="M110 690V280a190 190 0 0 1 380 0v410" stroke="#51434a" opacity=".4" />
    <ellipse cx="300" cy="704" rx="120" ry="18" fill="#100d0f" />
    <path d="M80 736h440M300 40v40" stroke="#c7a15a" opacity=".6" />
  </svg>;
}
