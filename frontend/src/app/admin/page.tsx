"use client";

import { useEffect, useState } from 'react';
import {
  Trophy, IndianRupee, UserCheck, ShieldAlert,
  Users, Layers, Settings, FileText, QrCode, Mail, PlusCircle, Check
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, offline, checkin, whatsapp
  const [stats, setStats] = useState({
    totalConfirmed: 0,
    totalRevenue: 0,
    checkedInCount: 0,
    categoryBreakdown: []
  });
  const [recentRunners, setRecentRunners] = useState([]);
  const [whatsappLogs, setWhatsappLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Offline Registration state
  const [offlineForm, setOfflineForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    tshirtSize: '',
    medicalDetails: '',
    emergencyName: '',
    emergencyPhone: '',
    categoryId: '',
    paymentMethod: 'CASH', // CASH, POS, UPI
    paymentId: ''
  });
  const [offlineSuccess, setOfflineSuccess] = useState('');
  
  // Check-In state
  const [checkInQuery, setCheckInQuery] = useState('');
  const [scannedRunner, setScannedRunner] = useState(null);
  const [checkInMessage, setCheckInMessage] = useState('');
  const [checkInError, setCheckInError] = useState('');

  // Fetch Dashboard Stats and Data
  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setRecentRunners(statsData.recentRunners);
      }

      const logsRes = await fetch('http://localhost:5000/api/admin/whatsapp-logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setWhatsappLogs(logsData);
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to connect to backend server. Make sure the backend node server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle Offline Form Input
  const handleOfflineChange = (e) => {
    const { name, value } = e.target;
    setOfflineForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Offline Form
  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    setOfflineSuccess('');
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineForm)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit offline registration');
      }

      setOfflineSuccess(`Successfully registered ${data.runner.name} with Bib ${data.runner.bibNumber}!`);
      // Reset form
      setOfflineForm({
        name: '',
        email: '',
        phone: '',
        gender: '',
        tshirtSize: '',
        medicalDetails: '',
        emergencyName: '',
        emergencyPhone: '',
        categoryId: '',
        paymentMethod: 'CASH',
        paymentId: ''
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Submit Check-In
  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    setCheckInMessage('');
    setCheckInError('');

    if (!checkInQuery) return;

    try {
      const res = await fetch('http://localhost:5000/api/admin/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: checkInQuery })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Check-in failed');
      }

      setScannedRunner(data.runner);
      setCheckInMessage(data.message || 'Check-in completed!');
      fetchData();
    } catch (err) {
      setCheckInError(err.message);
      setScannedRunner(null);
    }
  };

  // Trigger simulated Scan
  const simulateQRScan = (runner) => {
    setCheckInQuery(runner.bibNumber || runner.id);
    setCheckInMessage('');
    setCheckInError('');
    setScannedRunner(runner);
  };

  // Run Abandoned Cart Recovery
  const runCartRecovery = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/trigger-abandoned-recovery', {
        method: 'POST'
      });
      const data = await res.json();
      alert(`Recovery check executed!\n${data.message}`);
      fetchData();
    } catch (err) {
      alert('Error triggering recovery: ' + err.message);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '40px 0 100px 0' }}>
      <div className="glowing-bg glow-purple" />
      <div className="glowing-bg glow-cyan" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header Title */}
        <div className="flex-between" style={{ marginBottom: '40px' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Organizer Panel</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage registrations, monitor slot locks, and issue runner kits.</p>
          </div>
          <button
            onClick={runCartRecovery}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', color: 'var(--warning)', borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}
            title="Sends automated WhatsApp nudge to pending registrations created > 1 minute ago"
          >
            ⏰ Trigger Abandoned Cart Recovery
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            padding: '16px',
            borderRadius: '12px',
            color: 'var(--accent)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <ShieldAlert size={24} />
            <div>
              <h4 style={{ fontWeight: 700 }}>Connection Warning</h4>
              <p style={{ fontSize: '0.875rem', marginTop: '2px' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '30px',
          paddingBottom: '2px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: <Layers size={16} /> },
            { id: 'offline', label: 'Offline Entries Desk', icon: <PlusCircle size={16} /> },
            { id: 'checkin', label: 'Kit Check-In Desk', icon: <QrCode size={16} /> },
            { id: 'whatsapp', label: 'WhatsApp Logs Audit', icon: <Mail size={16} /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab View: Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div className="grid-3" style={{ marginBottom: '40px' }}>
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Confirmed</span>
                  <Trophy size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '12px' }}>{stats.totalConfirmed}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active registrations in database</p>
              </div>

              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Revenue</span>
                  <IndianRupee size={20} style={{ color: 'var(--success)' }} />
                </div>
                <h3 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '12px', color: 'var(--success)' }}>
                  Rs. {stats.totalRevenue}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Confirmed transaction pricing</p>
              </div>

              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Kits Checked In</span>
                  <UserCheck size={20} style={{ color: 'var(--secondary)' }} />
                </div>
                <h3 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '12px' }}>{stats.checkedInCount}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Runners checked-in at expo desk</p>
              </div>
            </div>

            {/* Category Capacities */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Category Slots Allocation</h3>
            <div className="grid-3" style={{ marginBottom: '40px' }}>
              {stats.categoryBreakdown.map((cat) => {
                const fillPercent = Math.min(100, Math.round(((cat.capacity - cat.available) / cat.capacity) * 100));
                return (
                  <div key={cat.id} className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div className="flex-between" style={{ marginBottom: '12px' }}>
                      <h4 style={{ fontWeight: 700 }}>{cat.name}</h4>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)' }}>{cat.id}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      <div className="flex-between">
                        <span>Confirmed entries:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{cat.confirmed}</strong>
                      </div>
                      <div className="flex-between">
                        <span>Checkout Locks (Active):</span>
                        <strong style={{ color: 'var(--warning)' }}>{cat.locked}</strong>
                      </div>
                      <div className="flex-between">
                        <span>Slots Available:</span>
                        <strong style={{ color: 'var(--success)' }}>{cat.available} / {cat.capacity}</strong>
                      </div>
                    </div>
                    <div>
                      <div style={{ height: '6px', background: 'rgba(15,23,42,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${fillPercent}%`,
                          background: fillPercent > 90 ? 'var(--accent)' :
                                      fillPercent > 70 ? 'var(--warning)' : 'var(--success)',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Registrations Log */}
            <div className="glass" style={{ padding: '30px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px' }}>Recent Registrations Log</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Runner</th>
                      <th>Category</th>
                      <th>Bib Number</th>
                      <th>Status</th>
                      <th>Payment Source</th>
                      <th>Check-In</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRunners.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No registrations found.</td>
                      </tr>
                    ) : (
                      recentRunners.map(r => (
                        <tr key={r.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{r.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.email} | {r.phone}</div>
                          </td>
                          <td>{r.category.name}</td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                              {r.bibNumber || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>{r.paymentMethod || 'N/A'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.paymentId || ''}</div>
                          </td>
                          <td>
                            {r.checkedIn ? (
                              <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <Check size={14} /> Kit Issued
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not Collected</span>
                            )}
                          </td>
                          <td>
                            {r.status === 'CONFIRMED' && !r.checkedIn && (
                              <button
                                onClick={() => {
                                  setActiveTab('checkin');
                                  simulateQRScan(r);
                                }}
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '4px' }}
                              >
                                Check-In Desk
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab View: Offline Entries Desk */}
        {activeTab === 'offline' && (
          <div className="glass" style={{ padding: '40px', borderRadius: '16px', maxWidth: '650px', margin: '0 auto' }}>
            <h2 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              Offline Registration Desk
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              Volunteers: Log on-site cash, card machine (POS), or direct UPI transactions here. Confirms registration and prints BIB instantly.
            </p>

            {offlineSuccess && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                color: 'var(--success)',
                marginBottom: '24px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                {offlineSuccess}
              </div>
            )}

            <form onSubmit={handleOfflineSubmit}>
              {/* Category Dropdown */}
              <div className="form-group">
                <label className="form-label">Race Category</label>
                <select
                  name="categoryId"
                  value={offlineForm.categoryId}
                  onChange={handleOfflineChange}
                  className="form-control form-select"
                  required
                >
                  <option value="">Select a category...</option>
                  {stats.categoryBreakdown.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - Rs. {c.price} ({c.available} left)
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={offlineForm.paymentMethod}
                    onChange={handleOfflineChange}
                    className="form-control form-select"
                    required
                  >
                    <option value="CASH">Cash Payment</option>
                    <option value="POS">Card Machine (POS)</option>
                    <option value="UPI">UPI Direct Scan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Receipt / Txn ID (Optional)</label>
                  <input
                    type="text"
                    name="paymentId"
                    value={offlineForm.paymentId}
                    onChange={handleOfflineChange}
                    placeholder="e.g. REC-93820"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '24px 0 12px 0', borderBottom: '1px solid var(--border)', paddingBottom: '6px', color: 'var(--text-primary)' }}>
                Runner Personal Details
              </h3>
              
              <div className="form-group">
                <label className="form-label">Runner Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={offlineForm.name}
                  onChange={handleOfflineChange}
                  placeholder="Full Name"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={offlineForm.email}
                    onChange={handleOfflineChange}
                    placeholder="runner@example.com"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={offlineForm.phone}
                    onChange={handleOfflineChange}
                    placeholder="Phone number"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={offlineForm.gender}
                    onChange={handleOfflineChange}
                    className="form-control form-select"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">T-Shirt Size</label>
                  <select
                    name="tshirtSize"
                    value={offlineForm.tshirtSize}
                    onChange={handleOfflineChange}
                    className="form-control form-select"
                    required
                  >
                    <option value="">Select Size...</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Medical details (Optional)</label>
                <input
                  type="text"
                  name="medicalDetails"
                  value={offlineForm.medicalDetails}
                  onChange={handleOfflineChange}
                  placeholder="Asthma, etc."
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Emergency Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={offlineForm.emergencyName}
                    onChange={handleOfflineChange}
                    placeholder="Contact name"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Phone</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={offlineForm.emergencyPhone}
                    onChange={handleOfflineChange}
                    placeholder="Contact number"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '16px', borderRadius: '8px' }}
              >
                💾 Confirm Registration & Assign Bib
              </button>
            </form>
          </div>
        )}

        {/* Tab View: Kit Check-In Desk */}
        {activeTab === 'checkin' && (
          <div className="glass" style={{ padding: '40px', borderRadius: '16px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              Kit Collection Desk
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              Scan runner QR code or search by Bib Number to verify details and hand over their T-shirt & Bib kit.
            </p>

            <form onSubmit={handleCheckInSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
              <input
                type="text"
                value={checkInQuery}
                onChange={(e) => setCheckInQuery(e.target.value)}
                placeholder="Scan / Enter Bib (e.g. HM-M-0001) or Runner ID..."
                className="form-control"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                🔍 Verify & Check-In
              </button>
            </form>

            {checkInError && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                color: 'var(--accent)',
                fontSize: '0.9rem',
                marginBottom: '20px'
              }}>
                ❌ {checkInError}
              </div>
            )}

            {checkInMessage && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                color: 'var(--success)',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}>
                ✓ {checkInMessage}
              </div>
            )}

            {scannedRunner && (
              <div style={{
                background: 'rgba(15,23,42,0.02)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  Runner Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Full Name:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{scannedRunner.name}</strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Bib Number:</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{scannedRunner.bibNumber}</strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Category:</span>
                    <strong>{scannedRunner.category?.name || scannedRunner.categoryId}</strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-secondary)' }}>T-Shirt Size:</span>
                    <strong style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>{scannedRunner.tshirtSize}</strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Medical Issues:</span>
                    <span style={{ color: scannedRunner.medicalDetails ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {scannedRunner.medicalDetails || 'None disclosed'}
                    </span>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Emergency Contact:</span>
                    <span>{scannedRunner.emergencyName} ({scannedRunner.emergencyPhone})</span>
                  </div>
                  <div className="flex-between" style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Kit Issued:</span>
                    {scannedRunner.checkedIn ? (
                      <span className="badge badge-confirmed">Kit Collected</span>
                    ) : (
                      <span className="badge badge-pending">Not Collected</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab View: WhatsApp Logs Audit */}
        {activeTab === 'whatsapp' && (
          <div className="glass" style={{ padding: '30px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>WhatsApp Template Messages Auditor</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Audits the simulated WhatsApp template outputs. Displays verification QR codes sent to runners.
            </p>

            <div style={{ display: 'grid', gap: '20px' }}>
              {whatsappLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No WhatsApp notifications triggered yet. Confirm a registration to send templates.
                </div>
              ) : (
                whatsappLogs.map(log => (
                  <div key={log.id} style={{
                    background: 'rgba(15,23,42,0.01)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap'
                  }}>
                    {/* Left details */}
                    <div style={{ flex: '2 1 350px' }}>
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{log.runnerName}</strong>
                        <span className="badge badge-confirmed" style={{ fontSize: '0.65rem' }}>{log.status}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        To: {log.phone} | Sent: {new Date(log.sentAt).toLocaleString()}
                      </div>
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace'
                      }}>
                        {log.message}
                      </div>
                    </div>
                    {/* Right QR Image */}
                    {log.qrCode && (
                      <div style={{
                        flex: '1 0 140px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft: '1px dashed var(--border)',
                        paddingLeft: '24px'
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={log.qrCode}
                          alt="QR Code"
                          style={{
                            width: '120px',
                            height: '120px',
                            background: '#fff',
                            padding: '4px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
                          Expo Verification QR
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
