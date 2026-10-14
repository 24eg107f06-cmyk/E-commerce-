import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../services/api';
import {
  User,
  Package,
  Heart,
  TrendingUp,
  MapPin,
  Lock,
  LogOut,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit personal info state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // New address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userApi.getProfile();
        const p = res.data?.data || res.data;
        if (p) {
          setProfileData(p);
          setFullName(p.fullName || '');
          setPhone(p.phone || '');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await userApi.updateProfile({
        fullName,
        phone,
        password: password || undefined,
      });
      if (res.data) {
        setProfileData(res.data);
        updateUser({ fullName: res.data.fullName });
        setPassword('');
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await userApi.addAddress(newAddress);
      if (res.data) {
        const refreshed = await userApi.getProfile();
        setProfileData(refreshed.data);
        setShowAddressForm(false);
        setNewAddress({
          fullName: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false,
        });
        addToast('Delivery address saved!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to add address', 'error');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await userApi.deleteAddress(addressId);
      const refreshed = await userApi.getProfile();
      setProfileData(refreshed.data);
      addToast('Address deleted', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete address', 'error');
    }
  };

  if (loading || !profileData) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Loading Profile Dashboard...</h2>
      </div>
    );
  }

  // Count items from recently viewed in localStorage
  let viewedCount = 12;
  try {
    const v = localStorage.getItem('myshop_recently_viewed');
    if (v) viewedCount = JSON.parse(v).length || 12;
  } catch {}

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: 1040 }}>
      {/* Profile Header */}
      <div
        className="card"
        style={{
          padding: 32,
          marginBottom: 36,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            }}
          >
            {profileData.fullName ? profileData.fullName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {profileData.fullName}
              </h1>
              {profileData.role === 'ROLE_ADMIN' && (
                <span style={{ backgroundColor: '#2563eb', padding: '3px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700 }}>
                  ADMIN
                </span>
              )}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4 }}>
              {profileData.email} • {profileData.phone || 'Phone not set'}
            </p>
          </div>
        </div>

        <button onClick={logout} className="btn btn-outline btn-sm" style={{ borderColor: '#475569', color: '#ffffff', backgroundColor: 'transparent' }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {/* =========================================================
          UNIQUE FEATURE: SHOPPING INSIGHTS
          ========================================================= */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Sparkles size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Your Shopping Insights
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <TrendingUp size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Products Explored</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>{viewedCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: 4 }}>Curated for you</div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <Heart size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Wishlist Items</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>{profileData.totalWishlistItems || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Saved favorites</div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Package size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>{profileData.totalOrders || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Lifetime purchases</div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Favorite Category</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)' }}>{profileData.favoriteCategory || 'Electronics'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Top browsing trend</div>
          </div>
        </div>
      </section>

      {/* Main Settings Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="profile-grid">
        {/* =========================================================
            PERSONAL INFORMATION FORM
            ========================================================= */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20, color: 'var(--secondary)' }}>
            Personal Information
          </h3>

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-control"
                value={profileData.email}
                disabled
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={savingProfile} className="btn btn-primary" style={{ marginTop: 8 }}>
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* =========================================================
            SAVED ADDRESSES
            ========================================================= */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)' }}>
              Saved Addresses
            </h3>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          {/* New Address Form Modal/Inline */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 20, border: '1px solid var(--border)' }}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="form-control"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Phone"
                  className="form-control"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Street Address"
                  className="form-control"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="City"
                  className="form-control"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  className="form-control"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  className="form-control"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </form>
          )}

          {/* List of saved addresses */}
          {(!profileData.addresses || profileData.addresses.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No delivery addresses saved yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {profileData.addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: addr.isDefault ? 'var(--primary-light)' : 'var(--surface)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {addr.fullName}
                      {addr.isDefault && (
                        <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--primary)', color: 'white', padding: '1px 6px', borderRadius: 4 }}>
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: 2 }}>{addr.street}</div>
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Phone: {addr.phone}</div>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ color: '#94a3b8', padding: 4 }}
                    title="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
