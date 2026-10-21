'use client';
import { useId } from 'react';
import { BrandLogo } from './brand-logo';

/** Original ribbon artwork framing the supplied Mellowoof heart-paw mark. */
export function RibbonAward({ earned = true }: { earned?: boolean }) {
  const id = useId().replaceAll(':', '');
  const points = Array.from({ length: 48 }, (_, index) => {
    const angle = (index * Math.PI) / 24 - Math.PI / 2;
    const radius = index % 2 === 0 ? 60 : 55;
    return `${80 + Math.cos(angle) * radius},${71 + Math.sin(angle) * radius}`;
  }).join(' ');
  return (
    <div className={`ribbon-award${earned ? '' : ' is-locked'}`} aria-hidden="true">
      <svg viewBox="0 0 160 184" fill="none" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient
            id={`${id}-foil`}
            x1="29"
            y1="19"
            x2="131"
            y2="135"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={earned ? '#B78624' : '#A5AB9F'} />
            <stop offset=".27" stopColor={earned ? '#F9DE8D' : '#E5E8DF'} />
            <stop offset=".52" stopColor={earned ? '#D8AB43' : '#BAC1B2'} />
            <stop offset=".75" stopColor={earned ? '#F3D580' : '#E0E5D9'} />
            <stop offset="1" stopColor={earned ? '#AB7A1C' : '#989F91'} />
          </linearGradient>
          <linearGradient
            id={`${id}-ribbon`}
            x1="50"
            y1="100"
            x2="117"
            y2="177"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={earned ? '#AD791C' : '#9BA590'} />
            <stop offset=".5" stopColor={earned ? '#E6BA51' : '#CAD1BF'} />
            <stop offset="1" stopColor={earned ? '#C4912F' : '#AAB49E'} />
          </linearGradient>
        </defs>
        <path
          d="M51 101 28 163l23-7 14 19 22-68"
          fill={`url(#${id}-ribbon)`}
          stroke={earned ? '#AA7A26' : '#9EA792'}
          strokeLinejoin="round"
        />
        <path
          d="m77 108 21 67 14-19 23 7-25-65"
          fill={`url(#${id}-ribbon)`}
          stroke={earned ? '#AA7A26' : '#9EA792'}
          strokeLinejoin="round"
        />
        <path
          d="m59 116-13 35m53-35 14 35"
          stroke={earned ? '#FFE6A0' : '#EEF0E8'}
          strokeWidth="2"
          strokeLinecap="round"
          opacity=".7"
        />
        <polygon
          points={points}
          fill={`url(#${id}-foil)`}
          stroke={earned ? '#B98B32' : '#A6AF9A'}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle
          cx="80"
          cy="71"
          r="48"
          fill={earned ? '#FFFAE9' : '#F5F6F0'}
          stroke={earned ? '#A77A28' : '#A7B09A'}
          strokeWidth="1.4"
        />
        <circle cx="80" cy="71" r="43" stroke={earned ? '#DFBF6C' : '#C4CCB9'} strokeWidth="1.2" />
        <circle
          cx="80"
          cy="71"
          r="38"
          stroke={earned ? '#CAAA5D' : '#BBC4AE'}
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
        <path
          d="m80 24 1.8 3.7 4.2.6-3 2.9.7 4.1-3.7-1.9-3.7 1.9.7-4.1-3-2.9 4.2-.6Z"
          fill={earned ? '#A77A28' : '#A7B09A'}
        />
      </svg>
      <BrandLogo mark decorative className="ribbon-award-logo" />
    </div>
  );
}
