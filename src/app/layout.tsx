import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "frosted-ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workforce",
  description: "Built with Whop's Frosted UI design system",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col">
        <Theme
          appearance="dark"
          accentColor="blue"
          grayColor="gray"
          hasBackground
          className="min-h-full flex flex-col [--default-font-family:var(--font-geist-sans)] [--code-font-family:var(--font-geist-mono)]"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
