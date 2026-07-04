import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';

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
      <body>
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.7)', // Light glass effect (use rgba(15, 23, 42, 0.7) for dark mode)
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(34, 197, 94, 0.2)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Logo Section */}
            <Link href="/" style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)', // Nature green gradient
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '-0.5px'
            }}>
              <span style={{ fontSize: '1.8rem' }}>🌿</span>
              <span>CONSERVE NATURE</span>
            </Link>

            {/* Navigation Section */}
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontWeight: 500
            }}>
              <Link href="/" style={{ textDecoration: 'none', color: '#374151', transition: 'color 0.2s' }}>
                Home
              </Link>
              <Link href="/register" style={{ textDecoration: 'none', color: '#374151', transition: 'color 0.2s' }}>
                Register
              </Link>
              <Link href="/admin" style={{ textDecoration: 'none', color: '#374151', transition: 'color 0.2s' }}>
                Admin Portal
              </Link>
              
              {/* Primary Call to Action Button */}
              <Link href="/register" style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: 'white',
                padding: '10px 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                transition: 'transform 0.2s, boxShadow 0.2s'
              }}>
                Join the Race
              </Link>
            </nav>
          </div>
        </header>
        
        <main style={{ minHeight: 'calc(100vh - 180px)', position: 'relative', paddingTop: '20px' }}>
          {children}
        </main>
        
        <footer style={{
          background: '#111827',
          borderTop: '1px solid #1f2937',
          padding: '40px 0',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '0.875rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontWeight: 600, color: '#f3f4f6' }}>© 2026 Conserve Nature Marathon. All rights reserved.</p>
            <p style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
              Built for scale with Next.js, Express, Prisma & WhatsApp Cloud API
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}