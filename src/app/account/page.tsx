"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./Account.css";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useGSAP(() => {
    gsap.fromTo(
      ".animate-element",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" }
    );
  }, { scope: containerRef });

  useEffect(() => {
    // Check if user is authenticated via API route
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          logout();
          router.push("/login");
          return;
        }
        
        // Fetch orders
        const ordersRes = await fetch("/api/account/orders");
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          if (data.success) {
            setOrders(data.orders);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [logout, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };

  // Prevent flashing the account layout if the user is not authenticated
  if (!isAuthenticated) {
    return <div className="account-page" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }} />;
  }

  return (
    <div className="account-page" ref={containerRef}>
      <div className="account-container">
        <div className="account-header animate-element">
          <h1 className="account-title">My Account</h1>
          <button className="account-logout" onClick={handleLogout}>Sign Out</button>
        </div>

        <div className="account-content">
          <div className="account-sidebar animate-element">
            <div className="account-info">
              <h3>Profile</h3>
              {user ? (
                <>
                  <p>{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                </>
              ) : (
                <p>Loading profile...</p>
              )}
            </div>
          </div>

          <div className="account-main animate-element">
            <h2 className="text-2xl font-playfair mb-6">Order History</h2>
            
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="p-8 border border-[var(--border-primary)] text-center">
                <p className="text-[var(--text-secondary)]">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-details">
                      <h4>Order #{order.id}</h4>
                      <p>{new Date(order.date_created).toLocaleDateString()} — {order.currency} {order.total}</p>
                    </div>
                    <div className="order-status">
                      {order.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
