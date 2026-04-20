import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClearBot · Your idea. Perfected.',
  description:
    "An AI-assisted design studio. Brand identities, websites, and rescue jobs for sites that aren't quite working \u2014 made sharp, made fast, made yours.",
  icons: { icon: '/assets/favicon.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
