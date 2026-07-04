"use client";

import { useEffect, useState, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';
import HeroSection from '@/components/register/HeroSection';
import PersonalDetailsStep from '@/components/register/PersonalDetailsStep';
import MedicalSafetyStep from '@/components/register/MedicalSafetyStep';
import CheckoutSection from '@/components/register/CheckoutSection';
import ConfirmationSection from '@/components/register/ConfirmationSection';
import ExpiredSection from '@/components/register/ExpiredSection';

interface Category {
  id: string;
  name: string;
  price: number;
  description?: string;
  trees?: number;
  distance?: string;
  startTime?: string;
  capacity?: number;
}

interface Runner {
  id: string;
  name: string;
  bibNumber: string;
  status: string;
}

export default function Register() {
  const [step, setStep] = useState<'FORM' | 'CHECKOUT' | 'CONFIRMED' | 'EXPIRED'>('FORM');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formSection, setFormSection] = useState<1 | 2>(1);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    tshirtSize: '',
    medicalDetails: '',
    emergencyName: '',
    emergencyPhone: '',
    categoryId: ''
  });

  const [runnerId, setRunnerId] = useState('');
  const [confirmedRunner, setConfirmedRunner] = useState<Runner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse category query param on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          
          const params = new URLSearchParams(window.location.search);
          const catParam = params.get('category');
          if (catParam && data.some((c: Category) => c.id === catParam)) {
            setFormData(prev => ({ ...prev, categoryId: catParam }));
          }
        }
      } catch (err) {
        console.error('Error fetching categories, using fallback', err);
        setCategories([
          { id: '5KM', name: '5KM Eco Fun Run', price: 1500, description: 'Perfect for beginners. 1 Tree planted per runner.', distance: '5 KM', trees: 1 },
          { id: '10KM', name: '10KM Forest Challenge', price: 2500, description: 'Test your endurance. 3 Trees planted per runner.', distance: '10 KM', trees: 3 },
          { id: '21KM', name: '21KM Half Marathon', price: 4000, description: 'The ultimate trail. 5 Trees planted per runner.', distance: '21.1 KM', trees: 5 }
        ]);
      }
    }
    fetchCategories();
  }, []);

  // Countdown timer for slot locking
  useEffect(() => {
    if (step === 'CHECKOUT') {
      setTimeLeft(300);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStep('EXPIRED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.name || !formData.email || !formData.phone || !formData.gender || !formData.tshirtSize) {
      setError('Please fill in all required personal details and select a category.');
      return;
    }
    setError('');
    setFormSection(2);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit registration');

      setRunnerId(data.runnerId || `RUN-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep('CHECKOUT');
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err) {
      // Fallback for development visual testing if backend is offline
      console.warn("Backend unavailable, falling back to client simulation:", err);
      setRunnerId(`RUN-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep('CHECKOUT');
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/registrations/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runnerId,
          paymentId: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentMethod: 'ONLINE'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      setConfirmedRunner(data.runner);
      setStep('CONFIRMED');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      // Fallback simulation for local UI testing
      setConfirmedRunner({
        id: runnerId,
        name: formData.name,
        bibNumber: `BIB-${Math.floor(100 + Math.random() * 900)}`,
        status: 'Confirmed'
      });
      setStep('CONFIRMED');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === formData.categoryId);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId }));
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', // Soft minimalist background
      color: '#0f172a', 
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      paddingBottom: '100px' 
    }}>
      
      <HeroSection />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div style={{ 
        maxWidth: '750px', 
        margin: '-60px auto 0', // Pulls the form up slightly over the hero section
        padding: '0 24px', 
        position: 'relative', 
        zIndex: 10 
      }}>
        
        {step === 'FORM' && (
          <div className="responsive-form-card">
            
            {/* Minimalist Progress Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between', 
              marginBottom: '40px', 
              paddingBottom: '24px', 
              borderBottom: '1px solid #f1f5f9' 
            }}>
              <div>
                <span style={{ 
                  color: '#10b981', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  letterSpacing: '1px', 
                  textTransform: 'uppercase' 
                }}>
                  Step {formSection} of 2
                </span>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 900, 
                  color: '#0f172a', 
                  marginTop: '8px',
                  letterSpacing: '-0.5px' 
                }}>
                  {formSection === 1 ? 'Runner Registration' : 'Medical & Safety Info'}
                </h2>
              </div>
              
              {/* Premium Thin Progress Bar */}
              <div style={{ display: 'flex', gap: '4px', width: '80px' }}>
                <div style={{ flex: 1, height: '4px', borderRadius: '999px', background: '#10b981' }} />
                <div style={{ flex: 1, height: '4px', borderRadius: '999px', background: formSection === 2 ? '#10b981' : '#e2e8f0', transition: 'background-color 0.4s ease' }} />
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '16px 20px',
                borderRadius: '12px',
                color: '#ef4444',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '32px',
                fontSize: '0.95rem',
                fontWeight: 600
              }}>
                <ShieldAlert size={20} strokeWidth={2.5} />
                <span>{error}</span>
              </div>
            )}

            {formSection === 1 ? (
              <PersonalDetailsStep
                categories={categories}
                formData={formData}
                handleInputChange={handleInputChange}
                onCategorySelect={handleCategorySelect}
                onSubmit={handleNextSection}
              />
            ) : (
              <MedicalSafetyStep
                formData={formData}
                handleInputChange={handleInputChange}
                onBack={() => setFormSection(1)}
                onSubmit={handleFormSubmit}
                loading={loading}
              />
            )}
          </div>
        )}

        {/* --- CHECKOUT & SLOT LOCKING --- */}
        {step === 'CHECKOUT' && (
          <div className="responsive-form-card">
            <CheckoutSection
              formData={formData}
              selectedCategory={selectedCategory}
              timeLeft={timeLeft}
              formatTime={formatTime}
              onCancel={() => setStep('FORM')}
              onSubmit={handlePaymentSubmit}
              loading={loading}
            />
          </div>
        )}

        {/* --- CONFIRMATION --- */}
        {step === 'CONFIRMED' && confirmedRunner && (
          <ConfirmationSection
            confirmedRunner={confirmedRunner}
            selectedCategory={selectedCategory}
            formData={formData}
          />
        )}

        {/* --- SESSION EXPIRED --- */}
        {step === 'EXPIRED' && (
          <ExpiredSection
            onRestart={() => {
              setStep('FORM');
              setFormSection(1);
            }}
          />
        )}

      </div>
    </div>
  );
}