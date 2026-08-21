"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./Account.css";

type TabType = 'dashboard' | 'orders' | 'addresses' | 'details' | 'analytics';

const BASE_TABS: { id: TabType; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'details', label: 'Account details' },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const isAdmin = Boolean(
    user?.role?.toLowerCase() === 'administrator' || 
    user?.role?.toLowerCase() === 'admin' || 
    (Array.isArray(user?.roles) && user.roles.some((r: string) => ['administrator', 'admin'].includes(r.toLowerCase())))
  );

  const tabs: { id: TabType; label: string; badge?: string }[] = isAdmin
    ? [...BASE_TABS, { id: 'analytics' as TabType, label: 'Analytics', badge: 'Admin' }]
    : BASE_TABS;
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as TabType;
      if (tab && ["dashboard", "orders", "addresses", "details", "analytics"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  // States for sub-views and forms
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<'billing' | 'shipping' | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  useGSAP(() => {
    gsap.fromTo(
      ".animate-element",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          logout();
          router.push("/login");
          return;
        }
        
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }

        const ordersRes = await fetch("/api/account/orders");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success) {
            setOrders(ordersData.orders);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [logout, router, setUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };

  const handleUpdateDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const updates = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
    };

    try {
      const res = await fetch("/api/account/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setFormMessage({ type: 'success', text: 'Account details updated successfully.' });
        setUser({ ...user!, ...updates } as any);
      } else {
        setFormMessage({ type: 'error', text: data.error || 'Failed to update details.' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const type = editingAddress; // 'billing' or 'shipping'
    
    const addressData = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      address_1: formData.get('address_1'),
      city: formData.get('city'),
      state: formData.get('state'),
      postcode: formData.get('postcode'),
      country: formData.get('country'),
    };

    const updates = {
      [type as string]: addressData
    };

    try {
      const res = await fetch("/api/account/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setFormMessage({ type: 'success', text: 'Address updated successfully.' });
        setUser({ ...user!, [type as string]: addressData } as any);
        setEditingAddress(null);
      } else {
        setFormMessage({ type: 'error', text: data.error || 'Failed to update address.' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setFormLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="account-page" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="account-dashboard animate-element">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-[var(--space-4)]">
              <h2 className="font-sans text-xl lg:text-2xl font-light tracking-tight">
                Welcome back, {user?.first_name || user?.email?.split('@')[0]}
              </h2>
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-mono tracking-widest font-semibold bg-[#A38A61]/15 text-[#D4AF37] border border-[#A38A61]/30 rounded-[1px] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  Role: Admin
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)] mt-[var(--space-6)]">
              <div className="p-[var(--space-4)] border border-[var(--border-primary)]">
                <div className="flex items-center justify-between mb-[var(--space-3)]">
                  <h3 className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)]">
                    Profile Snapshot
                  </h3>
                  {isAdmin && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[var(--bg-secondary)] text-[#D4AF37] border border-[#A38A61]/30 rounded-[1px]">
                      Admin
                    </span>
                  )}
                </div>
                <p className="font-sans text-sm font-light mb-2">
                  <strong className="font-medium">Name:</strong> {user?.first_name} {user?.last_name}
                </p>
                <p className="font-sans text-sm font-light mb-2">
                  <strong className="font-medium">Email:</strong> {user?.email}
                </p>
                {isAdmin && (
                  <p className="font-sans text-sm font-light mb-4">
                    <strong className="font-medium">Role:</strong> <span className="font-mono text-xs text-[#D4AF37] font-semibold">Admin</span>
                  </p>
                )}
                <button onClick={() => setActiveTab('details')} className="account-inline-link text-sm">
                  Edit Details
                </button>
              </div>

              <div className="p-[var(--space-4)] border border-[var(--border-primary)] flex flex-col justify-between">
                <div>
                  <h3 className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)] mb-[var(--space-3)]">
                    Quick Actions
                  </h3>
                  <p className="font-sans text-sm font-light text-[var(--text-secondary)] mb-4">
                    Ready to discover your next luxury piece? Explore our latest curated collections.
                  </p>
                </div>
                <button onClick={() => router.push('/products')} className="account-btn w-full text-center">
                  Browse Collections
                </button>
              </div>

              {isAdmin && (
                <div className="p-[var(--space-4)] border border-[#A38A61]/40 bg-[#A38A61]/5 flex flex-col justify-between md:col-span-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37]">
                        Executive Administration
                      </span>
                      <span className="px-2 py-0.5 text-[9px] uppercase font-mono bg-[#A38A61]/20 text-[#D4AF37] border border-[#A38A61]/40 rounded-[1px]">
                        Role: Admin
                      </span>
                    </div>
                    <h3 className="font-sans text-base font-normal text-[var(--text-primary)] mb-1">
                      Store Analytics & Telemetry Hub
                    </h3>
                    <p className="font-sans text-xs font-light text-[var(--text-secondary)] mb-4">
                      Real-time revenue settlement, conversion funnels, edge geo-location telemetry, and visualizer interactions.
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => router.push('/admin/analytics')} 
                      className="account-btn inline-flex items-center gap-2"
                      style={{ borderColor: 'var(--accent-primary, #A38A61)', color: 'var(--accent-primary, #D4AF37)' }}
                    >
                      Open Executive Analytics →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'analytics':
        if (!isAdmin) return null;
        return (
          <div className="account-analytics animate-element">
            <div className="flex items-center justify-between mb-[var(--space-4)]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37] block">
                  Executive Suite
                </span>
                <h2 className="font-sans text-xl lg:text-2xl font-light tracking-tight mt-0.5">
                  Store Analytics & Performance Hub
                </h2>
              </div>
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono bg-[#A38A61]/15 text-[#D4AF37] border border-[#A38A61]/30 rounded-[1px]">
                Role: Admin
              </span>
            </div>

            <div className="p-6 border border-[#A38A61]/30 bg-[var(--bg-tertiary,#141414)] rounded-[2px] space-y-4">
              <p className="font-sans text-sm font-light text-[var(--text-secondary,#aaa)] leading-relaxed">
                As an authenticated <strong className="text-[#D4AF37] font-medium">Admin</strong>, you have full access to the House of Decór Executive Analytics Platform. Monitor verified WooCommerce revenue settlement, Vercel edge geographic distribution, conversion funnels, and room visualizer telemetry in real time.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => router.push('/admin/analytics')}
                  className="account-btn inline-flex items-center gap-2"
                  style={{ backgroundColor: 'var(--accent-primary, #A38A61)', color: '#FFFFFF', borderColor: 'var(--accent-primary, #A38A61)' }}
                >
                  Launch Full Analytics Dashboard →
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'orders':
        if (selectedOrder) {
          return (
            <div className="account-order-details animate-element">
              <button onClick={() => setSelectedOrder(null)} className="account-inline-link mb-4">← Back to Orders</button>
              <h2 className="font-sans text-xl lg:text-2xl font-light mb-4 tracking-tight">Order #{selectedOrder.id}</h2>
              <p className="font-sans text-sm font-light text-[var(--text-secondary)] mb-6">
                Placed on {new Date(selectedOrder.date_created).toLocaleDateString()} and is currently <strong className="font-medium">{selectedOrder.status}</strong>.
              </p>
              
              <div className="border border-[var(--border-primary)] p-4 mb-6">
                <h3 className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold mb-4 border-b border-[var(--border-primary)] pb-2 text-[var(--text-secondary)]">Order Details</h3>
                <ul className="flex flex-col gap-3 mb-4">
                  {selectedOrder.line_items.map((item: any) => (
                    <li key={item.id} className="flex justify-between font-sans text-sm font-medium">
                      <span>{item.name} <strong className="ml-2 font-semibold">× {item.quantity}</strong></span>
                      <span className="font-semibold">{selectedOrder.currency} {item.total}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-sans text-sm font-semibold border-t border-[var(--border-primary)] pt-3">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)]">Total</span>
                  <span className="text-xl md:text-2xl font-medium tracking-tight">{selectedOrder.currency} {selectedOrder.total}</span>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="account-orders animate-element">
            {loading ? (
              <p className="account-dashboard-text">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="account-empty-state">
                <p className="account-dashboard-text">You haven't placed any orders yet.</p>
                <button onClick={() => router.push('/products')} className="account-btn mt-[var(--space-3)]">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="orders-list">
                <div className="orders-header">
                  <div className="order-col">Order</div>
                  <div className="order-col">Date</div>
                  <div className="order-col">Status</div>
                  <div className="order-col">Total</div>
                  <div className="order-col">Actions</div>
                </div>
                {orders.map((order) => (
                  <div key={order.id} className="order-row">
                    <div className="order-col" data-label="Order">#{order.id}</div>
                    <div className="order-col" data-label="Date">{new Date(order.date_created).toLocaleDateString()}</div>
                    <div className="order-col" data-label="Status">{order.status}</div>
                    <div className="order-col" data-label="Total">{order.currency} {order.total}</div>
                    <div className="order-col" data-label="Actions">
                      <button onClick={() => setSelectedOrder(order)} className="account-btn-small">View</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'addresses':
        if (editingAddress) {
          const type = editingAddress;
          const currentAddr = user?.[type] || {};
          return (
            <div className="account-address-edit animate-element">
              <button onClick={() => setEditingAddress(null)} className="account-inline-link mb-4">← Back to Addresses</button>
              <h2 className="font-sans text-xl lg:text-2xl font-light mb-[var(--space-4)] tracking-tight">Edit {type} address</h2>
              
              {formMessage.text && (
                <div className={`p-3 mb-4 text-sm ${formMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {formMessage.text}
                </div>
              )}

              <form className="account-form" onSubmit={handleUpdateAddress}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name">First name *</label>
                    <input type="text" name="first_name" id="first_name" defaultValue={currentAddr.first_name || ""} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Last name *</label>
                    <input type="text" name="last_name" id="last_name" defaultValue={currentAddr.last_name || ""} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address_1">Street address *</label>
                  <input type="text" name="address_1" id="address_1" defaultValue={currentAddr.address_1 || ""} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Town / City *</label>
                    <input type="text" name="city" id="city" defaultValue={currentAddr.city || ""} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State / County *</label>
                    <input type="text" name="state" id="state" defaultValue={currentAddr.state || ""} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="postcode">Postcode / ZIP *</label>
                    <input type="text" name="postcode" id="postcode" defaultValue={currentAddr.postcode || ""} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <input type="text" name="country" id="country" defaultValue={currentAddr.country || ""} required />
                  </div>
                </div>
                <button type="submit" className="account-btn" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save address'}
                </button>
              </form>
            </div>
          );
        }

        return (
          <div className="account-addresses animate-element">
            <p className="account-dashboard-text mb-[var(--space-4)]">
              The following addresses will be used on the checkout page by default.
            </p>
            <div className="addresses-grid">
              <div className="address-box">
                <div className="address-header">
                  <h3>Billing address</h3>
                  <button onClick={() => setEditingAddress('billing')} className="account-inline-link">Edit</button>
                </div>
                <address className="address-content">
                  {user?.billing?.address_1 ? (
                    <>
                      {user.billing.first_name} {user.billing.last_name}<br/>
                      {user.billing.address_1}<br/>
                      {user.billing.city}, {user.billing.state} {user.billing.postcode}<br/>
                      {user.billing.country}
                    </>
                  ) : (
                    "You have not set up this type of address yet."
                  )}
                </address>
              </div>
              <div className="address-box">
                <div className="address-header">
                  <h3>Shipping address</h3>
                  <button onClick={() => setEditingAddress('shipping')} className="account-inline-link">Edit</button>
                </div>
                <address className="address-content">
                  {user?.shipping?.address_1 ? (
                    <>
                      {user.shipping.first_name} {user.shipping.last_name}<br/>
                      {user.shipping.address_1}<br/>
                      {user.shipping.city}, {user.shipping.state} {user.shipping.postcode}<br/>
                      {user.shipping.country}
                    </>
                  ) : (
                    "You have not set up this type of address yet."
                  )}
                </address>
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="account-details animate-element">
            {formMessage.text && (
              <div className={`p-3 mb-4 text-sm ${formMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {formMessage.text}
              </div>
            )}
            
            <form className="account-form" onSubmit={handleUpdateDetails}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First name *</label>
                  <input type="text" name="first_name" id="first_name" defaultValue={user?.first_name || ""} required />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last name *</label>
                  <input type="text" name="last_name" id="last_name" defaultValue={user?.last_name || ""} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address *</label>
                <input type="email" name="email" id="email" defaultValue={user?.email || ""} required />
              </div>

              {/* Note: WooCommerce API usually requires separate handling for password updates or special privileges, 
                  so we only update standard fields here for security. */}

              <button type="submit" className="account-btn" disabled={formLoading}>
                {formLoading ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="account-page" ref={containerRef}>
      <div className="account-container">
        
        <h1 className="account-title font-sans text-3xl md:text-4xl font-light tracking-wide animate-element mb-[var(--space-6)]">My account</h1>

        <div className="account-layout">
          {/* Sidebar Navigation */}
          <nav className="account-nav animate-element">
            <ul className="account-nav-list">
              {tabs.map(tab => (
                <li key={tab.id} className="account-nav-item">
                  <button 
                    className={`account-nav-link flex items-center justify-between ${activeTab === tab.id ? 'active' : ''} ${tab.id === 'analytics' ? 'text-[#D4AF37]' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedOrder(null);
                      setEditingAddress(null);
                      setFormMessage({ type: '', text: '' });
                    }}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-[#A38A61]/20 text-[#D4AF37] border border-[#A38A61]/40 rounded-[1px]">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li className="account-nav-item">
                <button className="account-nav-link" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </ul>
          </nav>

          {/* Main Content Area */}
          <div className="account-main">
            {renderContent()}
          </div>
        </div>

      </div>
    </div>
  );
}
