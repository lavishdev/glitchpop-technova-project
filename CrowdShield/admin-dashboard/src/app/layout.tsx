import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrowdShield Enterprise Admin Dashboard",
  description:
    "Real-time computer vision spatial tracking, threat mitigation, and emergency evacuation command.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="antialiased bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
