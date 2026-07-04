"use client";

import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ExpiredSectionProps {
  onRestart: () => void;
}

export default function ExpiredSection({ onRestart }: ExpiredSectionProps) {
  return (
    <div className="responsive-form-card" style={{
      textAlign: 'center',
      maxWidth: '550px',
      margin: '0 auto'
    }}>
      
      {/* Premium Alert Icon */}
      <div style={{
        display: 'inline-flex',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#ef4444',
        padding: '24px',
        borderRadius: '50%',
        marginBottom: '24px',
        boxShadow: '0 4px 20px -5px rgba(239, 68, 68, 0.15)'
      }}>
        <ShieldAlert size={48} strokeWidth={2} />
      </div>

      <h2 style={{ 
        fontSize: '2rem', 
        fontWeight: 900, 
        color: '#0f172a', 
        marginBottom: '12px',
        letterSpacing: '-0.5px' 
      }}>
        Slot Lock Expired
      </h2>
      
      <p style={{ 
        color: '#64748b', 
        marginBottom: '40px', 
        fontSize: '1.05rem', 
        lineHeight: 1.6,
        maxWidth: '450px',
        margin: '0 auto 40px'
      }}>
        To ensure fair access during high traffic, slots are only locked for 5 minutes. Your bib number has been released back to other runners.
      </p>

      <button
        onClick={onRestart}
        style={{
          padding: '18px 40px',
          background: '#10b981',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px', // Pill shape matching the global design
          fontSize: '1.05rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.2s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
      >
        <RefreshCw size={20} strokeWidth={2.5} /> Restart Registration
      </button>
    </div>
  );
}