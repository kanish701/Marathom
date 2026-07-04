"use client";

import { Clock, CreditCard, Lock } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  price: number;
  trees?: number;
}

interface FormData {
  name: string;
  phone: string;
}

interface CheckoutSectionProps {
  formData: FormData;
  selectedCategory: Category | undefined;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function CheckoutSection({
  formData,
  selectedCategory,
  timeLeft,
  formatTime,
  onCancel,
  onSubmit,
  loading
}: CheckoutSectionProps) {
  
  // Reusable label style for the premium minimalist look
  const labelStyle = {
    display: 'block', 
    fontSize: '0.8rem', 
    fontWeight: 700, 
    color: '#475569', 
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#0f172a',
    fontSize: '1rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Slot Lock Alert Banner */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        padding: '16px 24px',
        borderRadius: '16px',
        color: '#d97706',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.05)'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <Clock size={18} strokeWidth={2.5} /> Slot Reserved Temporarily
        </span>
        <span style={{ fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', fontWeight: 900, letterSpacing: '1px' }}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          Finalize Registration
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Complete simulated gateway payment. If the timer expires, your bib number releases back to the general pool.
        </p>
      </div>

      {/* Order Summary Receipt Box */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1rem' }}>
          <span style={{ color: '#64748b', fontWeight: 500 }}>Runner Name</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{formData.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1rem' }}>
          <span style={{ color: '#64748b', fontWeight: 500 }}>Category & Impact</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{selectedCategory?.name} ({selectedCategory?.trees || 1} Trees)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1rem' }}>
          <span style={{ color: '#64748b', fontWeight: 500 }}>WhatsApp Confirmation</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{formData.phone}</span>
        </div>
        
        <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Payable</span>
          <span style={{ fontWeight: 900, fontSize: '2rem', color: '#0f172a', letterSpacing: '-1px' }}>Rs. {selectedCategory?.price}</span>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>
            Card Number (Simulated Gateway)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              maxLength={19}
              defaultValue="4000 1234 5678 9010"
              required
              style={{ ...inputStyle, paddingLeft: '48px', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px' }}
            />
            <CreditCard size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: '#94a3b8' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <input
              type="text"
              maxLength={5}
              defaultValue="12/28"
              required
              style={{ ...inputStyle, textAlign: 'center', fontFamily: 'monospace', fontSize: '1.1rem' }}
            />
          </div>
          <div>
            <label style={labelStyle}>CVV</label>
            <input
              type="password"
              maxLength={3}
              defaultValue="123"
              required
              style={{ ...inputStyle, textAlign: 'center', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '18px 24px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              color: '#475569',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '18px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#10b981')}
          >
            <Lock size={18} strokeWidth={2.5} /> {loading ? 'Processing Gateway...' : `Pay Rs. ${selectedCategory?.price} & Lock Bib`}
          </button>
        </div>
      </form>
    </div>
  );
}