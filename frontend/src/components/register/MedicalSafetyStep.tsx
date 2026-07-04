"use client";

import { HeartPulse, ArrowLeft, ArrowRight } from 'lucide-react';

interface FormData {
  medicalDetails: string;
  emergencyName: string;
  emergencyPhone: string;
}

interface MedicalSafetyStepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function MedicalSafetyStep({
  formData,
  handleInputChange,
  onBack,
  onSubmit,
  loading
}: MedicalSafetyStepProps) {
  
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

  // Reusable input style
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
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Alert / Telemetry Box */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        padding: '20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <HeartPulse size={24} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: '#065f46', display: 'block', marginBottom: '4px' }}>Why do we need this?</strong> 
          Your safety is paramount. On-course paramedics use this data to provide instant care during trail emergencies.
        </p>
      </div>

      {/* Medical Details */}
      <div>
        <label style={labelStyle}>
          Medical Conditions or Allergies <span style={{ color: '#94a3b8', textTransform: 'none', fontWeight: 500 }}>(Optional)</span>
        </label>
        <textarea
          name="medicalDetails"
          value={formData.medicalDetails}
          onChange={handleInputChange}
          placeholder="e.g. Asthma, Penicillin allergy, high blood pressure (Leave blank if none)"
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Emergency Contacts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div>
          <label style={labelStyle}>
            Emergency Contact Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            name="emergencyName"
            value={formData.emergencyName}
            onChange={handleInputChange}
            placeholder="Parent / Spouse / Friend"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>
            Emergency Contact Phone <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
            placeholder="+91 98765 00000"
            required
            style={inputStyle}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '18px 24px',
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            color: '#475569',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} /> Back
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
          {loading ? 'Locking Slot...' : 'Proceed to Payment'} <ArrowRight size={20} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}