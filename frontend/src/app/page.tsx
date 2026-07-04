"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Trophy, Zap, Target, ArrowRight, Flame } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([
    { id: '5K', name: '5K Fun Run', price: 400, capacity: 200, startTime: '06:30 AM', confirmed: 0, locked: 0, available: 200 },
    { id: '10K', name: '10K Challenge', price: 700, capacity: 150, startTime: '06:00 AM', confirmed: 0, locked: 12, available: 45 }, // Adjusted for visual demo
    { id: 'HALF', name: 'Half Marathon (21.1K)', price: 1200, capacity: 100, startTime: '05:00 AM', confirmed: 0, locked: 0, available: 0 } // Adjusted for visual demo
  ]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 12, hours: 8, minutes: 45, seconds: 12 });

  // 1. Live slot count polling
  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          if (data.stats && data.stats.categoryBreakdown) {
            setCategories(data.stats.categoryBreakdown);
          }
        }
      } catch (err) {
        console.log('Using default mock category counts');
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Countdown timer ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      color: '#0f172a',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Injecting a style block for clean hover micro-interactions */}
      <style dangerouslySetInnerHTML={{__html: `
        .premium-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.3);
        }
        .btn-primary {
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background-color: #059669 !important;
          transform: scale(1.02);
        }
      `}} />

      {/* --- HERO SECTION --- */}
      <section style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '80px 24px 0', 
        maxWidth: '1280px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '75vh'
      }}>
        
        {/* Subtle dot matrix background for editorial depth */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }} />

        <div className="responsive-hero-layout" style={{ flex: 1 }}>
          
          {/* Left: Monolithic Typography & CTA */}
          <div className="responsive-hero-left">
            <h1 style={{ 
              fontSize: 'clamp(4.5rem, 8vw, 7rem)', 
              fontWeight: 900, 
              lineHeight: 0.95, 
              letterSpacing: '-0.04em', 
              marginBottom: '40px', 
              color: '#0f172a'
            }}>
              Run!<br />
              Push!<br />
              <span style={{ color: '#10b981' }}>Conquer!</span>
            </h1>
            
            <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '420px', marginBottom: '40px', lineHeight: 1.6 }}>
              Join 5,000+ athletes. Secure your spot in the ultimate high-performance coastal marathon.
            </p>

            <Link href="/register" className="btn-primary" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '18px 48px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              textDecoration: 'none',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
            }}>
              Register Now <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Right/Bottom: Runner Illustration Area */}
          <div className="responsive-hero-right" style={{ alignItems: 'flex-end' }}>
            <img 
              src="/hero-marathon.png" 
              alt="Marathon Runners Illustration" 
              className="responsive-illustration-img"
              style={{
                maxWidth: '900px',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.05))'
              }}
            />
          </div>
        </div>
      </section>

      {/* --- TELEMETRY & INFO GRID --- */}
      <section style={{ 
        borderTop: '1px solid #f1f5f9', 
        borderBottom: '1px solid #f1f5f9', 
        backgroundColor: '#ffffff',
        position: 'relative', 
        zIndex: 2 
      }}>
        <div style={{ 
          maxWidth: '1280px', margin: '0 auto', 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' 
        }}>
          
          <div style={{ padding: '32px 24px', borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px' }}>
              <Calendar size={24} color="#10b981" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Oct 18, 2026</div>
            </div>
          </div>

          <div style={{ padding: '32px 24px', borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px' }}>
              <MapPin size={24} color="#10b981" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Apex Bay, CA</div>
            </div>
          </div>

          <div style={{ padding: '32px 24px', borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px' }}>
              <Trophy size={24} color="#10b981" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Prize Pool</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Rs. 15,00,000</div>
            </div>
          </div>

          {/* Premium Digital Watch Countdown */}
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Registration Closes In
            </div>
            <div style={{ display: 'flex', gap: '8px', fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', fontFamily: 'monospace' }}>
              <div style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{String(countdown.days).padStart(2, '0')}d</div>
              <span style={{ color: '#cbd5e1' }}>:</span>
              <div style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{String(countdown.hours).padStart(2, '0')}h</div>
              <span style={{ color: '#cbd5e1' }}>:</span>
              <div style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{String(countdown.minutes).padStart(2, '0')}m</div>
              <span style={{ color: '#cbd5e1' }}>:</span>
              <div style={{ background: '#f0fdf4', color: '#10b981', padding: '4px 8px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>{String(countdown.seconds).padStart(2, '0')}s</div>
            </div>
          </div>

        </div>
      </section>

      {/* --- CATEGORIES GRID --- */}
      <section id="categories" style={{ padding: '100px 24px', backgroundColor: '#f8fafc', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', margin: '0 0 12px 0' }}>
                Choose Your Distance
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
                Slots lock dynamically during checkout to prevent overbooking.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {categories.map((cat) => {
              const capacityPercent = Math.min(100, Math.round(((cat.capacity - cat.available) / cat.capacity) * 100));
              const isSoldOut = cat.available === 0;
              const isSellingFast = !isSoldOut && capacityPercent > 70;

              return (
                <div key={cat.id} className="premium-card" style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '24px',
                  padding: '40px',
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  
                  {isSellingFast && (
                    <div style={{
                      position: 'absolute', top: '-12px', right: '32px',
                      background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444',
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px',
                      display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 6px -1px rgba(239,68,68,0.1)'
                    }}>
                      <Flame size={14} fill="#ef4444" /> Selling Fast
                    </div>
                  )}
                  
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                    {cat.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '0 0 40px 0' }}>
                    <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-2px', lineHeight: 1 }}>
                      Rs. {cat.price}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>/ Runner</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, margin: '0 0 48px 0' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1rem', color: '#334155', fontWeight: 600 }}>
                      <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px' }}><Clock size={18} color="#10b981" /></div>
                      Starts at {cat.startTime}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1rem', color: '#334155', fontWeight: 600 }}>
                      <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px' }}><Target size={18} color="#10b981" /></div>
                      Official BIB & Timing Chip
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div style={{ margin: '0 0 40px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: isSoldOut ? '#ef4444' : '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <span>{isSoldOut ? 'Sold Out' : `${cat.available} Slots Left`}</span>
                      <span style={{ color: '#64748b' }}>{capacityPercent}% Filled</span>
                    </div>
                    
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                      <div style={{
                        height: '100%', width: `${capacityPercent}%`,
                        background: isSoldOut ? '#ef4444' : 'linear-gradient(90deg, #34d399, #10b981)',
                        borderRadius: '999px', transition: 'width 0.8s ease-out'
                      }} />
                    </div>
                    
                    {cat.locked > 0 && !isSoldOut && (
                      <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={14} fill="#d97706" /> {cat.locked} checkouts in progress
                      </div>
                    )}
                  </div>

                  <Link
                    href={{ pathname: '/register', query: { category: cat.id } }}
                    className={isSoldOut ? '' : 'btn-primary'}
                    style={{
                      background: isSoldOut ? '#f1f5f9' : '#10b981',
                      color: isSoldOut ? '#94a3b8' : '#ffffff',
                      padding: '20px', 
                      width: '100%', 
                      textAlign: 'center', 
                      borderRadius: '9999px',
                      fontWeight: 700, 
                      fontSize: '1rem', 
                      letterSpacing: '0.5px',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      pointerEvents: isSoldOut ? 'none' : 'auto',
                      border: isSoldOut ? '1px solid #e2e8f0' : 'none'
                    }}
                  >
                    {isSoldOut ? 'Registration Closed' : 'Select Challenge'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}