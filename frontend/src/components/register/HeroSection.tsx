"use client";

import { Sparkles, TreePine, Users, Award, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      padding: '80px 24px',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
    }}>
      {/* Subtle editorial dot-matrix background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.6,
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }} />

      <div className="responsive-hero-layout" style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 1,
        gap: '40px'
      }}>
        
        {/* Left: Monolithic Typography & Impact Ticker */}
        <div className="responsive-hero-left">
          
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '8px 20px',
            borderRadius: '9999px',
            color: '#059669',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '32px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={16} /> 
            2026 Registration Portal Live
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '24px',
            letterSpacing: '-1.5px',
            color: '#0f172a'
          }}>
            Run For The Earth.<br />
            <span style={{ color: '#10b981' }}>Leave A Legacy.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ 
            color: '#64748b', 
            fontSize: '1.15rem', 
            maxWidth: '550px', 
            marginBottom: '48px', 
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Every kilometer you run plants real trees in endangered rainforests. Secure your bib today with our instant WhatsApp verification and 5-minute slot locking system.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#10b981',
              color: 'white', padding: '16px 40px', borderRadius: '9999px',
              fontSize: '1.05rem', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Secure Your Slot <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
            
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              color: '#0f172a', padding: '16px 40px', borderRadius: '9999px',
              fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s ease, border-color 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <Play size={20} fill="#0f172a" /> Watch Promo
            </button>
          </div>

          {/* Live Impact Ticker (Structured Grid) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            
            <div className="responsive-ticker-item">
              <div style={{ color: '#10b981', fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TreePine size={24} /> 12,450+
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Trees Pledged
              </div>
            </div>
            
            <div className="responsive-ticker-item">
              <div style={{ color: '#3b82f6', fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={24} /> 3,200 <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700 }}>/ 5k</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Slots Claimed
              </div>
            </div>
            
            <div className="responsive-ticker-item" style={{ borderRight: 'none' }}>
              <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Award size={24} /> Rs. 15L
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Prize Pool
              </div>
            </div>

          </div>
        </div>

        {/* Right: Illustration Graphic */}
        <div className="responsive-hero-right">
           <img 
             src="/hero-marathon.png" 
             alt="Marathon Event Illustration" 
             className="responsive-illustration-img"
             style={{
               maxWidth: '850px',
               filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.04))'
             }}
           />
        </div>

      </div>
    </section>
  );
}