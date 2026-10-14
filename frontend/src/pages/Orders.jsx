import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await ordersApi.getUserOrders();
        const list = res.data?.data || res.data || [];
        if (Array.isArray(list)) {
          setOrders(list);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'PLACED': return 1;
      case 'CONFIRMED': return 2;
      case 'PACKED': return 3;
      case 'SHIPPED': return 4;
      case 'DELIVERED': return 5;
      default: return 1;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 440, margin: '0 auto', padding: '40px 24px' }}>
          <Package size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Please Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
            Sign in to track your current orders and view your purchase history.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <h1 className="heading-lg" style={{ marginBottom: 24 }}>Loading Orders...</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ width: '100%', height: 180, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', padding: '50px 32px' }}>
          <ShoppingBag size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>No Orders Placed Yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 24 }}>
            You haven't placed any orders with MYSHOP yet. Explore our curated collections!
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: 960 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="heading-lg" style={{ color: 'var(--secondary)' }}>
          My Orders ({orders.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
          Live order tracking and fulfillment timeline.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {orders.map((order) => {
          const activeStep = getStatusStep(order.status);

          return (
            <div key={order.id} className="card" style={{ padding: 28 }}>
              {/* Order Header */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  paddingBottom: 20,
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>
                      Order #{order.orderNumber}
                    </span>
                    <span
                      style={{
                        backgroundColor: order.status === 'DELIVERED' ? '#d1fae5' : '#eff6ff',
                        color: order.status === 'DELIVERED' ? '#065f46' : 'var(--primary)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <Calendar size={14} /> Placed on {formatDate(order.createdAt)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatPrice(order.finalAmount)}
                  </div>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              <div style={{ margin: '24px 0 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((stepLabel, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = activeStep >= stepNum;

                    return (
                      <div
                        key={stepLabel}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                          flex: 1,
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? 'var(--primary)' : 'var(--bg-muted)',
                            color: isCompleted ? 'white' : 'var(--text-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            border: isCompleted ? 'none' : '2px solid var(--border)',
                            zIndex: 2,
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: isCompleted ? 700 : 500,
                            color: isCompleted ? 'var(--text)' : 'var(--text-subtle)',
                          }}
                        >
                          {stepLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List in this Order */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg)',
                      borderRadius: '12px',
                    }}
                  >
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>
                        {item.productName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Quantity: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor}`}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)' }}>
                      {formatPrice(item.subtotal || item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping & Payment Meta */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: '1px solid var(--border-light)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={16} color="var(--primary)" />
                  <span>
                    Delivering to: <strong>{order.shippingFullName}</strong>, {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={16} color="var(--primary)" />
                  <span>
                    Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
