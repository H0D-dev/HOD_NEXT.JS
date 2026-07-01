"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "../auth.css";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      ".animate-element",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Register the user via WooCommerce
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const registerData = await registerRes.json();

      if (!registerData.success) {
        setError(registerData.error || "Registration failed");
        setLoading(false);
        return;
      }

      // 2. Redirect them to the login page so they can log in manually
      router.push("/login?message=registered");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" ref={containerRef}>
      <div className="auth-container animate-element">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join House of Décor for an exclusive experience</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              className="auth-input"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="last_name">Last Name (Optional)</label>
            <input
              id="last_name"
              type="text"
              className="auth-input"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-links animate-element">
          Already have an account? <Link href="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
