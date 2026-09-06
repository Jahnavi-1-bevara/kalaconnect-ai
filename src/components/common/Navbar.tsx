import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { SupportedLanguage, UserRole } from '../../types';
import {
  Globe,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Building2,
  ShieldCheck,
  Palette,
  ShoppingBag as CustomerIcon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, languages } = useTranslation();
  const {
    currentUser,
    switchRole,
    cartCount,
    setIsCartOpen,
    activeView,
    setActiveView,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode }> = {
    artisan: { label: t('auth.role_artisan', 'Artisan / Seller'), icon: <Palette className="w-4 h-4 text-craft-terracotta" /> },
    customer: { label: t('auth.role_customer', 'Customer'), icon: <CustomerIcon className="w-4 h-4 text-craft-forest" /> },
    b2b: { label: t('auth.role_b2b', 'Business Buyer (B2B)'), icon: <Building2 className="w-4 h-4 text-craft-brass" /> },
    admin: { label: t('auth.role_admin', 'Administrator'), icon: <ShieldCheck className="w-4 h-4 text-purple-700" /> },
  };

  const navLinks = [
    { id: 'landing', label: t('nav.home', 'Home') },
    { id: 'marketplace', label: t('nav.marketplace', 'Marketplace') },
    { id: 'how-it-works', label: t('nav.how_it_works', 'How It Works') },
    { id: 'b2b-dashboard', label: t('nav.b2b', 'B2B Sourcing') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-craft-linen/95 backdrop-blur-md border-b border-craft-sand transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveView('landing')}
          >
            <div className="w-11 h-11 rounded-xl bg-craft-terracotta flex items-center justify-center text-white shadow-craft-sm transition-transform group-hover:scale-105">
              <span className="font-serif font-bold text-xl tracking-tight">K</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl tracking-tight text-craft-charcoal group-hover:text-craft-terracotta transition-colors">
                  KalaConnect
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-craft-terracotta/10 text-craft-terracotta px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              </div>
              <p className="text-xs text-craft-muted font-serif italic hidden sm:block">
                {t('brand.tagline', 'From Your Craft to the World.')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-craft-terracotta bg-craft-terracotta/5'
                      : 'text-craft-charcoal/80 hover:text-craft-charcoal hover:bg-craft-stone'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Role Dashboard Quick Link */}
            <button
              onClick={() => {
                if (currentUser.role === 'artisan') setActiveView('artisan-dashboard');
                else if (currentUser.role === 'customer') setActiveView('customer-dashboard');
                else if (currentUser.role === 'b2b') setActiveView('b2b-dashboard');
                else if (currentUser.role === 'admin') setActiveView('admin-dashboard');
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-craft-charcoal/80 hover:text-craft-charcoal hover:bg-craft-stone transition-colors"
            >
              {t('nav.dashboard', 'Dashboard')}
            </button>
          </nav>

          {/* Right Controls: Language Selector, Role Switcher, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector (7 Languages Strictly, No Hindi) */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-craft-sand bg-white text-xs font-medium text-craft-charcoal hover:border-craft-terracotta transition-colors shadow-craft-sm"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-craft-muted" />
                <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
                <span className="sm:hidden">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-craft-muted" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-craft-lg border border-craft-sand py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-craft-muted uppercase tracking-wider border-b border-craft-sand/50">
                    Supported Languages
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as SupportedLanguage);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-craft-terracotta/10 text-craft-terracotta font-semibold'
                          : 'text-craft-charcoal hover:bg-craft-stone'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[11px] text-craft-muted">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Role Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-craft-sand bg-white text-xs font-medium text-craft-charcoal hover:border-craft-terracotta transition-colors shadow-craft-sm"
                aria-label="Switch User Role"
              >
                {roleLabels[currentUser.role]?.icon}
                <span className="hidden sm:inline font-medium">
                  {currentUser.role.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3 text-craft-muted" />
              </button>

              {isRoleOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-craft-lg border border-craft-sand py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-craft-muted uppercase tracking-wider border-b border-craft-sand/50">
                    {t('auth.select_role', 'Switch Role (4 Roles)')}
                  </div>
                  {(['artisan', 'customer', 'b2b', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsRoleOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.role === r
                          ? 'bg-craft-terracotta/10 text-craft-terracotta font-semibold'
                          : 'text-craft-charcoal hover:bg-craft-stone'
                      }`}
                    >
                      {roleLabels[r].icon}
                      <div>
                        <div className="font-medium capitalize">{r}</div>
                        <div className="text-[10px] text-craft-muted">
                          {r === 'artisan' && 'Add crafts & AI studio'}
                          {r === 'customer' && 'Buy & view orders'}
                          {r === 'b2b' && 'Bulk corporate procurement'}
                          {r === 'admin' && 'Platform governance'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-white border border-craft-sand text-craft-charcoal hover:border-craft-terracotta transition-colors shadow-craft-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-craft-charcoal" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-craft-terracotta text-white text-[10px] font-bold flex items-center justify-center animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Artisan Action CTA */}
            {currentUser.role === 'artisan' && (
              <button
                onClick={() => setActiveView('artisan-add-product')}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 bg-craft-terracotta text-white rounded-lg text-xs font-medium hover:bg-craft-terracotta-dark transition-colors shadow-craft-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('btn.add_product', 'Add Product')}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-craft-charcoal hover:bg-craft-stone rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-craft-sand bg-craft-linen px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveView(link.id);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-craft-charcoal rounded-lg hover:bg-craft-stone"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              if (currentUser.role === 'artisan') setActiveView('artisan-dashboard');
              else if (currentUser.role === 'customer') setActiveView('customer-dashboard');
              else if (currentUser.role === 'b2b') setActiveView('b2b-dashboard');
              else if (currentUser.role === 'admin') setActiveView('admin-dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-craft-terracotta font-semibold rounded-lg bg-craft-terracotta/10"
          >
            {t('nav.dashboard', 'My Dashboard')} ({currentUser.role.toUpperCase()})
          </button>
        </div>
      )}
    </header>
  );
};
