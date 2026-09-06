import React from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { SafeImage } from '../common/SafeImage';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { t } = useTranslation();
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    isCartOpen,
    setIsCartOpen,
    setActiveView,
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-craft-charcoal/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-craft-sand shadow-craft-xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-craft-sand flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-craft-terracotta" />
              <h2 className="text-lg font-serif font-bold text-craft-charcoal">
                {t('cart.title', 'Your Craft Bag')} ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-craft-muted hover:text-craft-charcoal hover:bg-craft-stone transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-14 h-14 rounded-2xl bg-craft-stone text-craft-muted flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-craft-charcoal">
                    {t('cart.empty', 'Your cart is empty.')}
                  </h3>
                  <p className="text-xs text-craft-muted max-w-xs">
                    {t(
                      'cart.empty_desc',
                      'Explore our marketplace to support Indian master artisans.'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('marketplace');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-craft-terracotta text-white text-xs font-semibold shadow-craft-sm"
                >
                  Explore Handicrafts
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl border border-craft-sand bg-craft-stone/20 flex gap-3.5 relative"
                >
                  <SafeImage
                    src={item.product.enhancedImageUrl || item.product.originalImageUrl}
                    alt={item.product.title}
                    className="w-18 h-18 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-craft-charcoal line-clamp-1">
                        {item.product.title}
                      </h4>
                      <div className="text-[11px] text-craft-muted">
                        By {item.product.artisanName}
                      </div>
                      <div className="text-xs font-bold text-craft-charcoal mt-1">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-craft-sand rounded-lg bg-white overflow-hidden shadow-craft-sm">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-craft-muted hover:text-craft-charcoal hover:bg-craft-stone"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-craft-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-craft-muted hover:text-craft-charcoal hover:bg-craft-stone"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-craft-muted hover:text-red-600"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-craft-sand bg-craft-linen/80 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-craft-muted">
                  <span>{t('cart.subtotal', 'Subtotal')}</span>
                  <span className="font-semibold text-craft-charcoal">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-craft-muted">
                  <span>{t('cart.shipping', 'Shipping & Fair Trade Packaging')}</span>
                  <span className="font-semibold text-craft-forest">
                    {t('cart.free_shipping', 'FREE')}
                  </span>
                </div>
                <div className="pt-2 border-t border-craft-sand flex justify-between text-sm font-bold text-craft-charcoal">
                  <span>{t('cart.total', 'Total')}</span>
                  <span className="text-base font-serif">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-semibold text-xs shadow-craft-md transition-colors flex items-center justify-center gap-2"
              >
                <span>{t('btn.checkout', 'Proceed to Checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-craft-forest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Secure Checkout • Fair Trade Direct Payout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
