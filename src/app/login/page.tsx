"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "../auth.css";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ username: "", password: "" });
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect") || "/account";
        router.push(redirectUrl);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" ref={containerRef}>
      <div className="auth-container animate-element">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your House of Décor account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="username">Email Address</label>
            <input
              id="username"
              type="email"
              className="auth-input"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-links animate-element">
          Don&apos;t have an account? <Link href="/register" className="auth-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
