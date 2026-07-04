"use client";

import { CheckCircle, Smartphone, ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  price: number;
  description?: string;
  trees?: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  tshirtSize: string;
  categoryId: string;
}

interface PersonalDetailsStepProps {
  categories: Category[];
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCategorySelect: (categoryId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PersonalDetailsStep({
  categories,
  formData,
  handleInputChange,
  onCategorySelect,
  onSubmit
}: PersonalDetailsStepProps) {
  
  // Reusable styles for the premium minimalist look
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
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '14px',
    paddingRight: '14px',
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
      
      {/* Category Selection Cards */}
      <div>
        <label style={labelStyle}>
          Select Race Distance <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {categories.map(c => {
            const isSelected = formData.categoryId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => onCategorySelect(c.id)}
                style={{
                  border: `2px solid ${isSelected ? '#10b981' : '#e2e8f0'}`,
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                  padding: '16px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  boxShadow: isSelected ? '0 10px 20px -5px rgba(16, 185, 129, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', color: '#10b981' }}>
                    <CheckCircle size={20} strokeWidth={2.5} />
                  </div>
                )}
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{c.name}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981', margin: '6px 0 2px', letterSpacing: '-0.5px' }}>
                  Rs. {c.price}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  {c.description || `${c.trees || 1} Tree planted`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Name */}
      <div>
        <label style={labelStyle}>
          Full Legal Name (For Certificate) <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. Kanishkar Dharmalingam"
          required
          style={inputStyle}
        />
      </div>

      {/* Email & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div>
          <label style={labelStyle}>
            Email Address <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@example.com"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>
            WhatsApp Number (For Instant Bib) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              required
              style={{ ...inputStyle, paddingLeft: '48px' }}
            />
            <Smartphone size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
          </div>
        </div>
      </div>

      {/* Gender & T-Shirt */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div>
          <label style={labelStyle}>
            Gender <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            style={inputStyle}
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>
            Eco-Dry T-Shirt Size <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            name="tshirtSize"
            value={formData.tshirtSize}
            onChange={handleInputChange}
            required
            style={inputStyle}
          >
            <option value="">Select Size...</option>
            <option value="S">Small (S - 36")</option>
            <option value="M">Medium (M - 38")</option>
            <option value="L">Large (L - 40")</option>
            <option value="XL">Extra Large (XL - 42")</option>
            <option value="XXL">Double XL (XXL - 44")</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '9999px', // Pill shape matching the hero section
          fontSize: '1.05rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
          marginTop: '8px',
          transition: 'transform 0.2s ease, background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
      >
        <span>Next: Medical & Safety</span> <ArrowRight size={20} strokeWidth={2.5} />
      </button>
    </form>
  );
}