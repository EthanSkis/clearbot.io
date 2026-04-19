import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClearBot · A full-service creative agency, run by bots',
  description:
    "Brand systems, websites, ad campaigns, content, video \u2014 the work a creative agency does, run by bots that don't sleep, don't drift off-brand, and don't bill you by the hour.",
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
