import type { LessonCategory } from '@/lib/lesson-types';

const coat = '#E2D8CC';
const ear = '#8C8379';
const cream = '#F9EFDB';
const ink = '#3D3933';

function PuppyHead({ barking = false, sleepy = false }: { barking?: boolean; sleepy?: boolean }) {
  return (
    <>
      <path
        d="M96 59C49 37 40 103 57 142c8 22 37 8 46-25M203 59c47-22 56 44 39 83-8 22-37 8-46-25"
        fill={ear}
      />
      <path d="M69 102c0-45 29-65 80-65s83 22 83 65c0 57-27 86-81 86S69 157 69 102Z" fill={coat} />
      <ellipse cx="104" cy="91" rx="23" ry="27" fill={ear} />
      <circle cx="192" cy="70" r="12" fill={ear} />
      <path d="M121 61q28-19 55 0l-9 68h-32Z" fill={cream} opacity=".65" />
      <ellipse cx="150" cy="145" rx="44" ry="30" fill={cream} />
      {sleepy ? (
        <path
          d="M100 111q10 10 20 0M181 111q10 10 20 0"
          fill="none"
          stroke={ink}
          strokeWidth="5"
          strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse cx="111" cy="109" rx="6" ry="8" fill={ink} />
          <ellipse cx="190" cy="109" rx="6" ry="8" fill={ink} />
          <circle cx="113" cy="106" r="2" fill="white" />
          <circle cx="192" cy="106" r="2" fill="white" />
        </>
      )}
      <path d="M137 134q13-8 26 0c3 10-8 16-13 16s-15-6-13-16Z" fill={ink} />
      {barking ? (
        <>
          <ellipse cx="150" cy="164" rx="15" ry="13" fill={ink} />
          <path d="M141 169q9-6 18 0v5q-9 7-18 0" fill="#D79289" />
        </>
      ) : (
        <path
          d="M150 149v7m-14-1q14 18 28 0"
          fill="none"
          stroke={ink}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
      <ellipse cx="101" cy="138" rx="12" ry="7" fill="#D79289" opacity=".45" />
      <ellipse cx="198" cy="138" rx="12" ry="7" fill="#D79289" opacity=".45" />
    </>
  );
}

function Butterfly({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-20)`}>
      <path d="M0 0C-22-26-26 10 0 8C26-13 17-30 0 0" fill="#E7BB70" />
      <path d="m0-3 2 14" stroke="#8C7350" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** Original category scenes using the same soft palette and speckled pup as our profile art. */
export function CategoryDogArt({
  category,
  className = '',
}: {
  category: LessonCategory;
  className?: string;
}) {
  const sleeping = category === 'Separation worries';
  const running = category === 'Recall & focus';
  const walking = category === 'Walking';
  const bathing = category === 'Bathing';
  const chewing = category === 'Chewing';
  const scent = category === 'Scent & enrichment';
  const care = category === 'Cooperative care';
  return (
    <svg
      className={`category-dog-art ${className}`}
      viewBox="0 0 300 260"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="150" cy="237" rx="114" ry="12" fill="#334F3D" opacity=".08" />
      {sleeping ? (
        <>
          <ellipse cx="150" cy="213" rx="124" ry="34" fill="#8DA48A" />
          <ellipse cx="150" cy="205" rx="108" ry="27" fill="#D7DFCB" />
          <ellipse cx="170" cy="170" rx="74" ry="52" fill={coat} />
          <path
            d="M218 159c35 51-43 74-62 42"
            fill="none"
            stroke={ear}
            strokeWidth="22"
            strokeLinecap="round"
          />
          <g transform="translate(-10 74) scale(.72)">
            <PuppyHead sleepy />
          </g>
          <ellipse cx="127" cy="213" rx="29" ry="10" fill={cream} />
          <path
            d="m188 86 18-3-14 21 20-3m15-46 22-3-17 25 24-3"
            fill="none"
            stroke="#7D9676"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : walking || running ? (
        <>
          {walking && (
            <>
              <path d="M27 231q120-24 247 0l-5 14H32Z" fill="#B4C49C" />
              <path
                d="m47 229-5-13m5 13 8-17m180 18-4-13m4 13 10-12"
                stroke="#7C9C70"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <Butterfly x={54} y={75} />
              <Butterfly x={265} y={111} />
            </>
          )}
          <path
            d="M86 160Q37 156 43 119"
            fill="none"
            stroke={ear}
            strokeWidth="19"
            strokeLinecap="round"
          />
          <ellipse cx="139" cy="170" rx="70" ry="40" fill={coat} />
          <path
            d={
              running
                ? 'm96 185-27 36m55-26 14 25m38-28 32 20m-4-29 34 7'
                : 'm95 190-9 40m37-37 9 34m45-36-4 39m23-45 14 40'
            }
            stroke={ear}
            strokeWidth="17"
            strokeLinecap="round"
          />
          <g transform="translate(90 13) scale(.65)">
            <PuppyHead />
          </g>
          <path d="m179 129 43 8" stroke="#49745B" strokeWidth="7" strokeLinecap="round" />
          <circle cx="198" cy="141" r="6" fill="#F2CB74" />
          {running && (
            <>
              <circle cx="188" cy="120" r="22" fill="#CA685D" />
              <path d="M173 109q15 5 21 28" fill="none" stroke="#F4C3A9" strokeWidth="3" />
              <path
                d="M42 182H22m29 15H32m28 15H47"
                stroke="#A9B79C"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          )}
        </>
      ) : (
        <>
          <path
            d="M213 190c57-37 60 19 33 17-20-2-20-14-28 0"
            fill="none"
            stroke={ear}
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path d="M90 225c-9-38 9-84 58-84s74 43 65 84" fill={coat} />
          <ellipse cx="150" cy="208" rx="32" ry="27" fill={cream} />
          <path
            d="M104 208l-7 25M193 208l7 25"
            stroke={ear}
            strokeWidth="28"
            strokeLinecap="round"
          />
          <PuppyHead barking={category === 'Barking'} sleepy={category === 'Everyday skills'} />
          <path d="M99 180q51 21 102 0" fill="none" stroke="#49745B" strokeWidth="9" />
          <circle cx="151" cy="191" r="9" fill="#F2CB74" />
          <ellipse cx="94" cy="235" rx="22" ry="9" fill={coat} />
          <ellipse cx="203" cy="235" rx="22" ry="9" fill={coat} />
          {category === 'Barking' && (
            <path
              d="m252 111 18-9m-16 29 23 1m-27 17 17 11"
              fill="none"
              stroke="#B18D52"
              strokeWidth="6"
              strokeLinecap="round"
            />
          )}
          {chewing && (
            <>
              <path
                d="M113 162c-13-17-30-1-20 10-13 12 4 28 16 13l81 1c12 16 30 1 18-11 13-12-3-28-17-13Z"
                fill="#F5E6C7"
                stroke="#B99B71"
                strokeWidth="3"
              />
              <path d="m122 168 56 2" stroke="#DFCA9F" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="111" cy="192" rx="13" ry="19" fill={coat} />
              <ellipse cx="192" cy="192" rx="13" ry="19" fill={coat} />
            </>
          )}
          {bathing && (
            <>
              <path d="M47 192h210l-14 42q-3 13-22 13H83q-20 0-23-13Z" fill="#A7BCC0" />
              <path d="M49 192h205" stroke="#D5E4DF" strokeWidth="13" strokeLinecap="round" />
              {[
                [72, 183, 14],
                [94, 178, 17],
                [122, 185, 13],
                [197, 180, 17],
                [226, 181, 14],
                [112, 38, 15],
                [134, 37, 13],
                [151, 42, 15],
                [49, 121, 10],
                [261, 69, 13],
                [246, 39, 7],
              ].map(([cx, cy, r]) => (
                <g key={`${cx}-${cy}`}>
                  <circle cx={cx} cy={cy} r={r} fill="#EDF5EE" stroke="#BAD4D3" strokeWidth="2" />
                  <circle cx={cx - 3} cy={cy - 4} r="3" fill="white" />
                </g>
              ))}
              <ellipse cx="103" cy="198" rx="18" ry="10" fill={coat} />
              <ellipse cx="199" cy="198" rx="18" ry="10" fill={coat} />
            </>
          )}
          {scent && (
            <>
              <path d="m54 230 32-36 38 35Z" fill="#A3B78D" />
              <path d="m178 234 25-31 33 31Z" fill="#C0CDAA" />
              <circle cx="86" cy="223" r="6" fill="#BC875C" />
              <path
                d="M75 177q-13-10 0-20m-14-4q-12-11 0-23"
                fill="none"
                stroke="#A2B399"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          )}
          {care && (
            <>
              <path d="M176 213q4-16 19-8l24 16-9 19-34-12Z" fill={cream} />
              <path d="m208 221 25 11" stroke="#B79777" strokeWidth="8" strokeLinecap="round" />
              <rect
                x="223"
                y="215"
                width="25"
                height="27"
                rx="8"
                fill="#9BAE91"
                transform="rotate(20 235 228)"
              />
              <path
                d="m228 221 10 4m-11 3 10 4m-12 3 10 4"
                stroke="#E9EEDC"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
          {category === 'Everyday skills' && (
            <>
              <path
                d="m45 69 3-10 4 10 10 4-10 4-4 10-3-10-10-4Zm211 84 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z"
                fill="#D4AF61"
              />
            </>
          )}
        </>
      )}
    </svg>
  );
}
