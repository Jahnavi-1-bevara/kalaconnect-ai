import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { UserRole } from '../../types';
import { Palette, ShoppingBag, Building2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { switchRole, setActiveView } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('artisan');
  const [email, setEmail] = useState('rameshwar.pottery@kalaconnect.in');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState('');

  const roles: { role: UserRole; title: string; desc: string; icon: React.ReactNode; defaultEmail: string }[] = [
    {
      role: 'artisan',
      title: t('auth.role_artisan', 'Artisan / Seller'),
      desc: 'Add crafts, run AI Product Studio, manage orders and view earnings.',
      icon: <Palette className="w-6 h-6 text-craft-terracotta" />,
      defaultEmail: 'rameshwar.pottery@kalaconnect.in',
    },
    {
      role: 'customer',
      title: t('auth.role_customer', 'Customer'),
      desc: 'Discover authentic GI handicrafts, purchase directly, and track orders.',
      icon: <ShoppingBag className="w-6 h-6 text-craft-forest" />,
      defaultEmail: 'ananya.sharma@gmail.com',
    },
    {
      role: 'b2b',
      title: t('auth.role_b2b', 'Business Buyer (B2B)'),
      desc: 'Source bulk orders for luxury hotels, interior design, and corporate gifting.',
      icon: <Building2 className="w-6 h-6 text-craft-brass" />,
      defaultEmail: 'vikram@heritageliving.com',
    },
    {
      role: 'admin',
      title: t('auth.role_admin', 'Administrator'),
      desc: 'Platform moderation, artisan verification, catalog audits, and analytics.',
      icon: <ShieldCheck className="w-6 h-6 text-purple-700" />,
      defaultEmail: 'admin@kalaconnect.ai',
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const found = roles.find((r) => r.role === role);
    if (found) setEmail(found.defaultEmail);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    switchRole(selectedRole);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-craft-sand shadow-craft-lg">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-craft-terracotta text-white items-center justify-center font-serif font-bold text-2xl shadow-craft-sm">
            K
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-craft-charcoal">
            {t('auth.login_title', 'Welcome to KalaConnect AI')}
          </h2>
          <p className="text-xs sm:text-sm text-craft-muted">
            {t('auth.login_subtitle', 'Sign in to access your specialized workspace')}
          </p>
        </div>

        {/* Role Picker */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-craft-charcoal uppercase tracking-wider block">
            {t('auth.select_role', 'Select Your Account Type')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => {
              const isSelected = selectedRole === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-craft-terracotta bg-craft-terracotta/5 shadow-craft-sm'
                      : 'border-craft-sand/70 bg-craft-stone/30 hover:border-craft-sand hover:bg-craft-stone/60'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-craft-sm shrink-0">
                    {r.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-craft-charcoal flex items-center justify-between">
                      <span>{r.title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-craft-terracotta shrink-0" />}
                    </div>
                    <p className="text-[11px] text-craft-muted leading-snug">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-craft-charcoal block mb-1">
              {t('auth.email_label', 'Email Address')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta bg-craft-linen/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-craft-charcoal block mb-1">
              {t('auth.password_label', 'Password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta bg-craft-linen/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-medium text-sm shadow-craft-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick 1-Click Demo Logins */}
        <div className="pt-4 border-t border-craft-sand/80 space-y-2">
          <div className="text-[11px] font-semibold text-craft-muted uppercase tracking-wider text-center">
            {t('auth.quick_demo', 'Quick 1-Click Demo Evaluation')}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['artisan', 'customer', 'b2b', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className="px-2.5 py-2 rounded-lg border border-craft-sand text-xs font-medium text-craft-charcoal hover:bg-craft-stone transition-colors text-center capitalize shadow-craft-sm"
              >
                As {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
