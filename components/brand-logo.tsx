import Image from 'next/image';

export function BrandLogo({
  mark = false,
  decorative = false,
  className = '',
  priority = false,
}: {
  mark?: boolean;
  decorative?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={mark ? '/brand/mellowoof-mark.svg' : '/brand/mellowoof-logo.svg'}
      alt={decorative ? '' : 'Mellowoof'}
      width={mark ? 512 : 1054}
      height={mark ? 512 : 841}
      className={`brand-logo ${className}`.trim()}
      unoptimized
      priority={priority}
    />
  );
}
