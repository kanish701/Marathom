"use client";

import { Sparkles, TreePine, Users, Award, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      padding: '48px 24px',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      minHeight: '65vh',
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
            padding: '6px 16px',
            borderRadius: '9999px',
            color: '#059669',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '16px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={14} /> 
            2026 Registration Portal Live
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 4.5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '16px',
            letterSpacing: '-1px',
            color: '#0f172a'
          }}>
            Run For The Earth.<br />
            <span style={{ color: '#10b981' }}>Leave A Legacy.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ 
            color: '#64748b', 
            fontSize: '1.05rem', 
            maxWidth: '550px', 
            marginBottom: '24px', 
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Every kilometer you run plants real trees in endangered rainforests. Secure your bib today with our instant WhatsApp verification and 5-minute slot locking system.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#10b981',
              color: 'white', padding: '12px 28px', borderRadius: '9999px',
              fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Secure Your Slot <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              color: '#0f172a', padding: '12px 28px', borderRadius: '9999px',
              fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s ease, border-color 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <Play size={18} fill="#0f172a" /> Watch Promo
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
            
            <div className="responsive-ticker-item" style={{ padding: '14px 18px' }}>
              <div style={{ color: '#10b981', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <TreePine size={20} /> 12,450+
              </div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Trees Pledged
              </div>
            </div>
            
            <div className="responsive-ticker-item" style={{ padding: '14px 18px' }}>
              <div style={{ color: '#3b82f6', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Users size={20} /> 3,200 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>/ 5k</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Slots Claimed
              </div>
            </div>
            
            <div className="responsive-ticker-item" style={{ borderRight: 'none', padding: '14px 18px' }}>
              <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Award size={20} /> Rs. 15L
              </div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
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