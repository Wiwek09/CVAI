import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'CV_AI',
  description: 'This is the project for cv detailing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        {/* <header className=' mb-[10rem] w-[100%] fixed top-0 z-50 px-4'>
          <Header />
        </header> */}
        <main className='mt-0 px-0 '>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
