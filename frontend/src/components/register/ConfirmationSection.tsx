"use client";

import Link from 'next/link';
import { CheckCircle, Smartphone } from 'lucide-react';

interface Category {
  name: string;
  trees?: number;
}

interface Runner {
  name: string;
  bibNumber: string;
}

interface FormData {
  phone: string;
}

interface ConfirmationSectionProps {
  confirmedRunner: Runner;
  selectedCategory: Category | undefined;
  formData: FormData;
}

export default function ConfirmationSection({
  confirmedRunner,
  selectedCategory,
  formData
}: ConfirmationSectionProps) {
  return (
    <div className="responsive-form-card" style={{
      textAlign: 'center',
      maxWidth: '650px',
      margin: '0 auto'
    }}>
      
      {/* Premium Success Icon */}
      <div style={{
        display: 'inline-flex',
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#10b981',
        padding: '24px',
        borderRadius: '50%',
        marginBottom: '24px',
        boxShadow: '0 4px 20px -5px rgba(16, 185, 129, 0.15)'
      }}>
        <CheckCircle size={48} strokeWidth={2} />
      </div>

      <h2 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 900, 
        color: '#0f172a', 
        marginBottom: '12px', 
        letterSpacing: '-0.5px' 
      }}>
        You're In, {confirmedRunner.name}!
      </h2>
      
      <p style={{ 
        color: '#64748b', 
        marginBottom: '40px', 
        fontSize: '1.05rem', 
        lineHeight: 1.6, 
        maxWidth: '500px', 
        margin: '0 auto 40px' 
      }}>
        Your payment has been reconciled. Your trees are being planted and your bib number is officially reserved.
      </p>

      {/* Minimalist Bib Badge Card */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '450px',
        margin: '0 auto 40px',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Official Bib Number
        </div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', margin: '12px 0', letterSpacing: '2px' }}>
          {confirmedRunner.bibNumber}
        </div>
        <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {selectedCategory?.name}
        </div>
      </div>

      {/* Clean WhatsApp Notification Box */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '20px',
        padding: '24px',
        textAlign: 'left',
        maxWidth: '500px',
        margin: '0 auto 40px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <Smartphone size={16} strokeWidth={2.5} /> WhatsApp Dispatch to {formData.phone}
        </div>
        
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid #e2e8f0',
          color: '#334155', 
          padding: '16px 20px', 
          borderRadius: '0 16px 16px 16px', 
          fontSize: '0.95rem', 
          lineHeight: 1.6,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' 
        }}>
          <strong>🌿 Conserve Nature Marathon</strong><br /><br />
          Hi {confirmedRunner.name}! Your registration for the <strong>{selectedCategory?.name}</strong> is confirmed.<br /><br />
          🏃 <strong>Bib Number:</strong> {confirmedRunner.bibNumber}<br />
          🌳 <strong>Impact:</strong> {selectedCategory?.trees || 1} Trees Pledged<br /><br />
          Show this WhatsApp message along with your QR Code at the expo desk to collect your Eco-Dry T-Shirt!
        </div>
      </div>

      {/* Pill-shaped Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" style={{
          padding: '16px 32px',
          background: '#ffffff',
          border: '2px solid #e2e8f0',
          color: '#475569',
          textDecoration: 'none',
          borderRadius: '9999px',
          fontWeight: 700,
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          Return to Home
        </Link>
        
        <Link href="/admin" style={{
          padding: '16px 32px',
          background: '#10b981',
          border: '2px solid #10b981',
          color: '#ffffff',
          textDecoration: 'none',
          borderRadius: '9999px',
          fontWeight: 700,
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.borderColor = '#059669'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.borderColor = '#10b981'; }}
        >
          View Admin Portal
        </Link>
      </div>
      
    </div>
  );
}