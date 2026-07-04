import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Conserve Nature Marathon 2026 | Run for the Earth",
  description: "Join the most impactful marathon of the year. Register online, secure your slot, and run to conserve nature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
      }}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}