import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tuck and Grow",
  description: "Give each payment a plan with clear, traceable budget buckets.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
