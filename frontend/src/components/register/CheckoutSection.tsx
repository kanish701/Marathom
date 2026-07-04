"use client";

import { useState } from 'react';
import { Clock, CreditCard, Lock, QrCode, Send, Check } from 'lucide-react';

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
  onSubmit: (paymentMethod: string, paymentId: string) => void;
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
  
  const [paymentTab, setPaymentTab] = useState<'CARD' | 'UPI'>('CARD');
  const [upiId, setUpiId] = useState('');
  const [upiRequestSent, setUpiRequestSent] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

  // Build UPI URI deep link
  const priceValue = selectedCategory?.price || 0;
  const upiUri = `upi://pay?pa=conservenature@upi&pn=Conserve%20Nature%20Marathon&am=${priceValue}&cu=INR&tn=Registration%20for%20${encodeURIComponent(formData.name)}`;
  
  // Public QR Code generation API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

  const handleSendUpiRequest = () => {
    if (!upiId) return;
    setUpiRequestSent(true);
    setTimeout(() => {
      setUpiRequestSent(false);
    }, 8000); // clear banner after 8 seconds
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentTab === 'CARD') {
      // Direct Card submit
      onSubmit('ONLINE', `PAY-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      // Simulated UPI verification spinner
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        const finalTxnId = upiTxnId || `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        onSubmit('UPI', finalTxnId);
      }, 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
      
      {/* Verification Overlay Overlay */}
      {isVerifying && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #cbd5e1',
            borderTopColor: '#10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Verifying UPI Payment...</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Checking reference {upiTxnId || 'auto-assigned'} with partner bank</p>
        </div>
      )}

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
          Complete your payment using your preferred payment method. Slots release if the reservation timer expires.
        </p>
      </div>

      {/* Payment Tabs Selector */}
      <div style={{
        display: 'flex',
        background: '#f1f5f9',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        gap: '4px'
      }}>
        <button
          type="button"
          onClick={() => setPaymentTab('CARD')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: paymentTab === 'CARD' ? '#ffffff' : 'transparent',
            color: paymentTab === 'CARD' ? '#0f172a' : '#64748b',
            boxShadow: paymentTab === 'CARD' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <CreditCard size={18} /> Card Payment
        </button>
        <button
          type="button"
          onClick={() => setPaymentTab('UPI')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: paymentTab === 'UPI' ? '#ffffff' : 'transparent',
            color: paymentTab === 'UPI' ? '#0f172a' : '#64748b',
            boxShadow: paymentTab === 'UPI' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <QrCode size={18} /> UPI / QR Scan
        </button>
      </div>

      {/* Order Summary Receipt Box */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px 32px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
          <span style={{ color: '#64748b', fontWeight: 500 }}>Runner Name</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{formData.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
          <span style={{ color: '#64748b', fontWeight: 500 }}>Category & Impact</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{selectedCategory?.name} ({selectedCategory?.trees || 1} Trees)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
          <span style={{ color: '#64748b', fontWeight: 500 }}>WhatsApp Dispatch</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{formData.phone}</span>
        </div>
        
        <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Payable</span>
          <span style={{ fontWeight: 900, fontSize: '1.75rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Rs. {priceValue}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {paymentTab === 'CARD' ? (
          <div>
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
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
            
            {/* Request via UPI ID */}
            <div>
              <label style={labelStyle}>Option 1: Request Payment via UPI ID</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. runner@upi)..."
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleSendUpiRequest}
                  disabled={!upiId}
                  className="btn btn-outline"
                  style={{
                    padding: '0 20px',
                    borderRadius: '12px',
                    borderColor: '#cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    height: '56px',
                    background: '#ffffff'
                  }}
                >
                  <Send size={16} /> Request
                </button>
              </div>
              
              {upiRequestSent && (
                <div style={{
                  marginTop: '12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#16a34a',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Check size={16} /> Collect request dispatched to <strong>{upiId}</strong>. Open GPay/PhonePe to pay!
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 800 }}>
              <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
              <span style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Or scan QR Code to pay</span>
              <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
            </div>

            {/* UPI QR Code Area */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              maxWidth: '280px',
              margin: '0 auto'
            }}>
              <img
                src={qrCodeUrl}
                alt="UPI Payment QR Code"
                style={{ width: '180px', height: '180px', marginBottom: '12px', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '6px' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.5px' }}>
                MERCHANT: CONSERVE NATURE
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                Scan with GPay, PhonePe, Paytm or BHIM
              </span>
            </div>

            {/* Manual transaction reference ID */}
            <div>
              <label style={labelStyle}>Option 2: Enter UPI Transaction ID (Reference No.)</label>
              <input
                type="text"
                maxLength={12}
                value={upiTxnId}
                onChange={(e) => setUpiTxnId(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter 12-digit UPI Ref Number (optional)..."
                style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '1px' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                We'll verify this transaction automatically. If empty, a demo reference will be generated.
              </span>
            </div>

          </div>
        )}

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
            <Lock size={18} strokeWidth={2.5} /> 
            {loading ? 'Processing Gateway...' : 
             paymentTab === 'CARD' ? `Pay Rs. ${priceValue} & Lock Bib` : 'Verify & Complete Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}