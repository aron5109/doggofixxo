import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mellowoof · Little steps. Happier tails.',
    short_name: 'Mellowoof',
    description: 'Kind dog training, one little step at a time.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFFCF4',
    theme_color: '#395D46',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
