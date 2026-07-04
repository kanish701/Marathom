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
        padding: '16px',
        borderRadius: '50%',
        marginBottom: '16px',
        boxShadow: '0 4px 20px -5px rgba(239, 68, 68, 0.15)'
      }}>
        <ShieldAlert size={36} strokeWidth={2} />
      </div>

      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 900, 
        color: '#0f172a', 
        marginBottom: '8px',
        letterSpacing: '-0.5px' 
      }}>
        Slot Lock Expired
      </h2>
      
      <p style={{ 
        color: '#64748b', 
        marginBottom: '20px', 
        fontSize: '0.95rem', 
        lineHeight: 1.6,
        maxWidth: '450px',
        margin: '0 auto 20px'
      }}>
        To ensure fair access during high traffic, slots are only locked for 5 minutes. Your bib number has been released back to other runners.
      </p>

      <button
        onClick={onRestart}
        style={{
          padding: '12px 28px',
          background: '#10b981',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px', // Pill shape matching the global design
          fontSize: '0.95rem',
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
        <RefreshCw size={18} strokeWidth={2.5} /> Restart Registration
      </button>
    </div>
  );
}