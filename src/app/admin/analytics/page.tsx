import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAnalyticsAccessServer } from "@/src/lib/auth/requireAnalyticsAccess";
import AnalyticsDashboard from "@/src/components/admin/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics Dashboard | House of Decór Admin",
  description: "Executive analytics and performance monitoring dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminAnalyticsPage() {
  // ── Server-Side RBAC Enforcement ──
  const auth = await requireAnalyticsAccessServer();

  // 1. Unauthenticated users are redirected to login with return path
  if (!auth.authorized && auth.status === 401) {
    redirect("/login?redirect=/admin/analytics");
  }

  // 2. Authenticated non-admin users receive 403 Forbidden screen
  if (!auth.authorized && auth.status === 403) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg-primary,#121212)] px-6 py-20 text-[var(--text-primary,#FAF9F5)]">
        <div className="max-w-md w-full border border-[var(--border-primary,#262626)] bg-[var(--bg-secondary,#1a1a1a)] p-8 md:p-10 shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-400 font-medium">403 Forbidden</span>
          <h1 className="font-sans text-2xl font-light tracking-tight mt-2 mb-4">Access Denied</h1>
          <p className="font-sans text-xs leading-relaxed text-[var(--text-secondary,#a3a3a3)] mb-8">
            Your account does not possess administrator privileges required to access the House of Decór Analytics module.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/account"
              className="w-full py-3 text-xs uppercase tracking-[0.15em] font-medium border border-[var(--border-primary,#333)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Return to Account
            </Link>
            <Link
              href="/"
              className="w-full py-3 text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. Authorized Administrator
  const adminUser = auth.user;

  return (
    <main className="min-h-screen bg-[var(--bg-primary,#0e0e0e)] text-[var(--text-primary,#f5f5f5)] pt-28 pb-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <AnalyticsDashboard adminUser={adminUser} />
      </div>
    </main>
  );
}
