import type { Metadata, Viewport } from 'next';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import './globals.css';
export const metadata: Metadata = {
  title: 'Mellowoof · Little steps. Happier tails.',
  description:
    'Kind, reward-based dog training. Gentle lessons, thoughtful routines, and little moments of progress.',
  applicationName: 'Mellowoof',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Mellowoof' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#395D46' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
