import type { ImageProps } from 'next/image';
export default function Image({ src, alt, width, height, className }: ImageProps) {
  // The browser harness exercises the UI without Next.js image optimization.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'string' ? src : ''}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
