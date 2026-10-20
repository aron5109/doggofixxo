export const avatarNames = [
  'Golden floppy ears',
  'Chocolate companion',
  'Cream mixed breed',
  'Black and tan pal',
  'Terrier friend',
  'Cloudy white pup',
  'Russet mixed breed',
  'Speckled sweetheart',
];
const coats = [
  '#DDA96E',
  '#96705B',
  '#E3D3B4',
  '#505452',
  '#C6B098',
  '#F3E9D8',
  '#BF7D59',
  '#E2D8CC',
];
const ears = [
  '#B98250',
  '#684D40',
  '#AF9675',
  '#323936',
  '#98836D',
  '#C8BDAA',
  '#93573C',
  '#8C8379',
];
export function DogArt({
  avatar = 0,
  mood = 'happy',
  className = '',
  decorative = false,
}: {
  avatar?: number;
  mood?: 'happy' | 'worried' | 'sleepy';
  className?: string;
  decorative?: boolean;
}) {
  const coat = coats[avatar];
  const ear = ears[avatar];
  const pointed = avatar === 3 || avatar === 4 || avatar === 6;
  return (
    <svg
      className={className}
      viewBox="0 0 300 260"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : `${mood} ${avatarNames[avatar]}`}
      aria-hidden={decorative || undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="152" cy="236" rx="99" ry="12" fill="#334F3D" opacity=".08" />
      <path
        d="M213 190c57-37 60 19 33 17-20-2-20-14-28 0"
        fill="none"
        stroke={ear}
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path d="M90 225c-9-38 9-84 58-84s74 43 65 84" fill={coat} />
      <ellipse cx="150" cy="208" rx="32" ry="27" fill="#F9EFDB" />
      <path d="M104 208l-7 25M193 208l7 25" stroke={ear} strokeWidth="28" strokeLinecap="round" />
      <ellipse cx="94" cy="235" rx="22" ry="9" fill={coat} />
      <ellipse cx="203" cy="235" rx="22" ry="9" fill={coat} />
      {pointed ? (
        <>
          <path d="M69 97L78 23l53 45M176 65l47-42 8 77" fill={ear} />
          <path d="M82 75l2-32 25 26M196 69l20-27 2 35" fill="#DEADA0" />
        </>
      ) : (
        <>
          <path d="M96 59C49 37 40 103 57 142c8 22 37 8 46-25" fill={ear} />
          <path d="M203 59c47-22 56 44 39 83-8 22-37 8-46-25" fill={ear} />
        </>
      )}
      <path d="M69 102c0-45 29-65 80-65s83 22 83 65c0 57-27 86-81 86S69 157 69 102Z" fill={coat} />
      {avatar === 7 && (
        <>
          <ellipse cx="104" cy="91" rx="23" ry="27" fill={ear} />
          <circle cx="192" cy="70" r="12" fill={ear} />
          <circle cx="214" cy="111" r="8" fill={ear} />
        </>
      )}
      <path d="M121 61q28-19 55 0l-9 68h-32Z" fill="#F9EFDB" opacity=".65" />
      <ellipse cx="150" cy="145" rx="44" ry="30" fill="#F9EFDB" />
      {mood === 'sleepy' ? (
        <>
          <path
            d="M100 111q10 10 20 0M181 111q10 10 20 0"
            fill="none"
            stroke="#3D3933"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse cx="111" cy="109" rx="6" ry="8" fill="#3D3933" />
          <ellipse cx="190" cy="109" rx="6" ry="8" fill="#3D3933" />
          <circle cx="113" cy="106" r="2" fill="white" />
          <circle cx="192" cy="106" r="2" fill="white" />
        </>
      )}
      {mood === 'worried' && (
        <path d="m99 89 15-5m72 0 15 5" stroke="#73533E" strokeWidth="4" strokeLinecap="round" />
      )}
      <path d="M137 134q13-8 26 0c3 10-8 16-13 16s-15-6-13-16Z" fill="#3D3933" />
      <path
        d={mood === 'worried' ? 'M150 150v6m-12 9q12-12 24 0' : 'M150 149v7m-14-1q14 18 28 0'}
        fill="none"
        stroke="#3D3933"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {mood === 'happy' && <path d="M143 165q7 5 14 0v9q-7 12-14 0Z" fill="#D79289" />}
      <ellipse cx="101" cy="138" rx="12" ry="7" fill="#D79289" opacity=".45" />
      <ellipse cx="198" cy="138" rx="12" ry="7" fill="#D79289" opacity=".45" />
      <path d="M99 180q51 21 102 0" fill="none" stroke="#49745B" strokeWidth="9" />
      <circle cx="151" cy="191" r="9" fill="#F2CB74" />
      <path d="m149 188 4 5m0-5-4 5" stroke="#A98035" strokeWidth="2" />
    </svg>
  );
}
