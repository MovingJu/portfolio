import type { Metadata } from 'next';
import '../styles/globals.scss';
import ThemeSelector from '@/components/ThemeSelector';
import { themeInitScript } from '@/lib/themes';

export const metadata: Metadata = {
  title: 'MovingJu',
  description: 'MovingJu blog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="dns-prefetch" href="https://MovingJu.disqus.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <script
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        />
      </head>
      <body>
        <ThemeSelector />
        {children}
        <script src="https://unpkg.com/htmx.org@1.9.11" defer />
      </body>
    </html>
  );
}
