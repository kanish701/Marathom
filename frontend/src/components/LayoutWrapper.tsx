"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* --- RESPONSIVE HEADER --- */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        transition: 'all 0.3s ease'
      }}>
        {/* CSS for Responsive Breakpoints */}
        <style dangerouslySetInnerHTML={{__html: `
          .desktop-nav { display: flex; align-items: center; gap: 32px; }
          .mobile-toggle { display: none; background: transparent; border: none; cursor: pointer; color: #0f172a; }
          .mobile-menu { display: none; }
          
          @media (max-width: 768px) {
            .desktop-nav { display: none; }
            .mobile-toggle { display: block; }
            .mobile-menu {
              display: flex;
              flex-direction: column;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: #ffffff;
              border-bottom: 1px solid #e2e8f0;
              padding: 24px;
              gap: 20px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
              clip-path: inset(0 0 100% 0);
              transition: clip-path 0.3s ease-out;
            }
            .mobile-menu.open {
              clip-path: inset(0 0 0 0);
            }
          }
        `}} />

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          
          <Link href="/" style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            color: '#0f172a',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '-0.5px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🌿</span>
            CONSERVE NATURE
          </Link>

          <nav className="desktop-nav">
            <Link href="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#10b981'} onMouseOut={(e) => e.currentTarget.style.color = '#475569'}>
              Home
            </Link>
            <Link href="/register" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#10b981'} onMouseOut={(e) => e.currentTarget.style.color = '#475569'}>
              Register
            </Link>
            <Link href="/admin" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#10b981'} onMouseOut={(e) => e.currentTarget.style.color = '#475569'}>
              Admin Portal
            </Link>
            
            <Link href="/register" style={{
              background: '#10b981',
              color: '#ffffff',
              padding: '12px 28px',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Join the Race
            </Link>
          </nav>

          <button 
            className="mobile-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <nav className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>Home</Link>
          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>Register</Link>
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0f172a', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>Admin Portal</Link>
          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} style={{
            background: '#10b981', color: '#ffffff', padding: '16px', textAlign: 'center', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '9999px', textDecoration: 'none', marginTop: '10px'
          }}>
            Join the Race
          </Link>
        </nav>
      </header>

      {/* --- PAGE CONTENT --- */}
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </main>

      {/* --- PREMIUM FOOTER --- */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '64px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 900, 
            color: '#0f172a', 
            letterSpacing: '-0.5px', 
            marginBottom: '16px' 
          }}>
            🌿 CONSERVE NATURE
          </div>
          
          <p style={{ 
            fontWeight: 600, 
            color: '#64748b', 
            fontSize: '0.95rem',
            margin: '0 0 16px 0'
          }}>
            © 2026 Conserve Nature Marathon. All rights reserved.
          </p>
          
          <p style={{ 
            margin: 0, 
            fontSize: '0.75rem', 
            color: '#94a3b8', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            fontWeight: 700
          }}>
            Built for scale with Next.js, Express, Prisma & WhatsApp Cloud API | Kanishkar Dharmalingam
          </p>
        </div>
      </footer>
    </>
  );
}