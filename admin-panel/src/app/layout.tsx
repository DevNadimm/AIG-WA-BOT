import type { Metadata } from"next";
import { Inter } from"next/font/google";
import"./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable:"--font-sans",
});

export const metadata: Metadata = {
  title:"AIG WA BOT - Admin",
  description:"WhatsApp Bot Configuration Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
