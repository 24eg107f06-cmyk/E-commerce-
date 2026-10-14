import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ordersApi, userApi } from '../services/api';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Step 1: Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || 'Sahasra Rao',
    phone: '+91 9123456789',
    street: 'Plot No. 42, Tech Boulevard, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
  });

  // Step 2: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // 'standard' (0) or 'express' (99)

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'COD'
  const [upiId, setUpiId] = useState('sahasra@oksbi');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8892',
    name: 'Sahasra Rao',
    expiry: '12/28',
    cvv: '•••',
  });

  // Redirect if cart is empty and order is not placed yet
  useEffect(() => {
    if (!placedOrder && (!cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, placedOrder, navigate]);

  const deliveryCost = deliveryMethod === 'express' ? 99 : cart.deliveryAmount || 0;
  const grandTotal = Math.max(0, cart.subtotal - cart.discountAmount + deliveryCost + cart.taxAmount);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      addToast('Please login to place your order securely', 'warning');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        shippingFullName: shippingAddress.fullName,
        shippingPhone: shippingAddress.phone,
        shippingStreet: shippingAddress.street,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingPincode: shippingAddress.pincode,
        paymentMethod: paymentMethod,
        couponCode: cart.couponCode || null,
        deliveryAmount: deliveryCost,
      };

      const res = await ordersApi.create(payload);
      if (res.data) {
        setPlacedOrder(res.data);
        setStep(4);
        clearCart();

        // Confetti Celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.warn('Confetti unavailable', e);
        }

        addToast('Order placed successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: 1000 }}>
      {/* Checkout Progress Stepper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 40,
          position: 'relative',
        }}
      >
        {[
          { num: 1, label: 'Address', icon: MapPin },
          { num: 2, label: 'Delivery', icon: Truck },
          { num: 3, label: 'Payment', icon: CreditCard },
          { num: 4, label: 'Confirmation', icon: CheckCircle2 },
        ].map((item, idx) => (
          <div
            key={item.num}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                backgroundColor:
                  step >= item.num ? 'var(--primary)' : 'var(--surface)',
                color: step >= item.num ? '#ffffff' : 'var(--text-muted)',
                border: step >= item.num ? '2px solid var(--primary)' : '2px solid var(--border)',
                boxShadow: step === item.num ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none',
                transition: 'all 0.25s',
              }}
            >
              <item.icon size={18} />
            </div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: step >= item.num ? 700 : 500,
                color: step >= item.num ? 'var(--text)' : 'var(--text-muted)',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Checkout Area */}
      <div style={{ display: 'grid', gridTemplateColumns: step === 4 ? '1fr' : '1.35fr 0.85fr', gap: 36 }} className="checkout-layout">
        <div>
          {/* =========================================================
              STEP 1: ADDRESS
              ========================================================= */}
          {step === 1 && (
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20, color: 'var(--secondary)' }}>
                Shipping Address
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address & Landmark</label>
                <input
                  type="text"
                  className="form-control"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.pincode) {
                    addToast('Please fill all required address fields', 'warning');
                    return;
                  }
                  setStep(2);
                }}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 16 }}
              >
                Continue to Delivery <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* =========================================================
              STEP 2: DELIVERY OPTIONS
              ========================================================= */}
          {step === 2 && (
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20, color: 'var(--secondary)' }}>
                Choose Delivery Speed
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div
                  onClick={() => setDeliveryMethod('standard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderRadius: '12px',
                    border: deliveryMethod === 'standard' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: deliveryMethod === 'standard' ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Truck size={24} color="var(--primary)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Standard Ground Delivery</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Delivery: 3-5 Business Days</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: cart.deliveryAmount === 0 ? '#10b981' : 'var(--text)' }}>
                    {cart.deliveryAmount === 0 ? 'FREE' : formatPrice(cart.deliveryAmount)}
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryMethod('express')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderRadius: '12px',
                    border: deliveryMethod === 'express' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: deliveryMethod === 'express' ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 24, height: 24, color: '#f59e0b' }}>⚡</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Express Priority Air Courier</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Delivery: Next Business Day Guaranteed</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text)' }}>₹99</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 1 }}>
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              STEP 3: PAYMENT SIMULATION
              ========================================================= */}
          {step === 3 && (
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, color: 'var(--secondary)' }}>
                Select Payment Method
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
                Academic Project Mode: Simulated payment transaction with real order database persistence.
              </p>

              {/* Payment Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'COD', label: 'Cash on Delivery', icon: PackageCheck },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      padding: '16px 12px',
                      borderRadius: '12px',
                      border: paymentMethod === pm.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: paymentMethod === pm.id ? 'var(--primary-light)' : 'var(--surface)',
                      color: paymentMethod === pm.id ? 'var(--primary)' : 'var(--text)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    <pm.icon size={22} />
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>

              {/* UPI Form */}
              {paymentMethod === 'UPI' && (
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
                  <div
                    style={{
                      width: 130,
                      height: 130,
                      backgroundColor: 'white',
                      margin: '0 auto 16px',
                      padding: 10,
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <QrCode size={110} color="#0f172a" />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                    Scan QR using Google Pay, PhonePe, or Paytm
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    or enter UPI ID: <strong>sahasra@oksbi</strong>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'CARD' && (
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 24 }}>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input type="text" className="form-control" value={cardDetails.number} readOnly />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input type="text" className="form-control" value={cardDetails.expiry} readOnly />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input type="text" className="form-control" value={cardDetails.cvv} readOnly />
                    </div>
                  </div>
                </div>
              )}

              {/* COD Form */}
              {paymentMethod === 'COD' && (
                <div style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                    💵 Pay exact cash or UPI at the doorstep upon physical product delivery.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(2)} className="btn btn-outline">
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                >
                  {submitting ? 'Placing Order...' : `Pay ${formatPrice(grandTotal)} & Confirm`}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              STEP 4: ORDER CONFIRMATION
              ========================================================= */}
          {step === 4 && placedOrder && (
            <div
              className="card"
              style={{
                padding: '48px 32px',
                textAlign: 'center',
                maxWidth: 680,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#d1fae5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={48} />
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 8 }}>
                Order Confirmed!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 24 }}>
                Thank you, <strong>{placedOrder.shippingFullName}</strong>! Your order has been placed and is currently being processed in our automated warehouse.
              </p>

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  marginBottom: 32,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 10 }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{placedOrder.orderNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount Paid:</span>
                  <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{formatPrice(placedOrder.finalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment Method:</span>
                  <span style={{ fontWeight: 600 }}>{placedOrder.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shipping To:</span>
                  <span style={{ fontWeight: 600 }}>{placedOrder.shippingCity}, {placedOrder.shippingState}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <Link to="/orders" className="btn btn-primary">
                  Track Order in "My Orders" <ArrowRight size={16} />
                </Link>
                <Link to="/products" className="btn btn-outline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            RIGHT COLUMN: ORDER SUMMARY
            ========================================================= */}
        {step < 4 && (
          <div>
            <div className="card" style={{ padding: 24, position: 'sticky', top: 96 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16 }}>
                Items in Order ({cart.totalItems})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
                {cart.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost summary */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981' }}>
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(cart.discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Delivery</span>
                  <span>{deliveryCost === 0 ? 'FREE' : formatPrice(deliveryCost)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Tax (5% GST)</span>
                  <span>{formatPrice(cart.taxAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 800px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
