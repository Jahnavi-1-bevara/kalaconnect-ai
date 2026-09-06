import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { LoginPage } from './components/auth/LoginPage';
import { ArtisanDashboard } from './components/artisan/ArtisanDashboard';
import { AddProductWizard } from './components/artisan/AddProductWizard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { B2BDashboard } from './components/b2b/B2BDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedProductForDetail,
    setSelectedProductForDetail,
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-craft-linen text-craft-charcoal selection:bg-craft-terracotta selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'marketplace' && <MarketplaceView />}
        {activeView === 'how-it-works' && <LandingPage />}
        {activeView === 'login' && <LoginPage />}
        {activeView === 'artisan-dashboard' && <ArtisanDashboard />}
        {activeView === 'artisan-add-product' && <AddProductWizard />}
        {activeView === 'customer-dashboard' && <CustomerDashboard />}
        {activeView === 'b2b-dashboard' && <B2BDashboard />}
        {activeView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
};

export default App;
