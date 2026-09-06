import React from 'react';
import { Product } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { X, ShoppingBag, ShieldCheck, MapPin, Sparkles, Check, Heart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { t } = useTranslation();
  const { addToCart, setIsCartOpen } = useApp();

  if (!product) return null;

  const handleBuyNow = () => {
    addToCart(product, 1);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-craft-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-craft-xl border border-craft-sand my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-craft-charcoal shadow-craft-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left: Large Product Image */}
          <div className="md:col-span-6 bg-craft-stone/60 relative min-h-[360px] md:min-h-[500px]">
            <SafeImage
              src={product.enhancedImageUrl || product.originalImageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-craft-charcoal shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-craft-terracotta" />
              <span>{product.category}</span>
            </div>
          </div>

          {/* Right: Product & Artisan Information */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-craft-terracotta">
                  {product.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-craft-charcoal mt-1 leading-snug">
                  {product.title}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-craft-charcoal">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-craft-forest font-semibold bg-craft-forest/10 px-2 py-0.5 rounded-full">
                  Fair Trade Price
                </span>
              </div>

              {/* Artisan Profile Box */}
              <div className="p-4 rounded-2xl bg-craft-stone/40 border border-craft-sand/80 space-y-1">
                <div className="text-xs text-craft-muted">Master Artisan:</div>
                <div className="text-sm font-bold text-craft-charcoal">{product.artisanName}</div>
                {product.artisanLocation && (
                  <div className="text-xs text-craft-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-craft-terracotta" />
                    <span>{product.artisanLocation}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-craft-charcoal uppercase tracking-wider">
                  Product Story & Details
                </h4>
                <p className="text-xs sm:text-sm text-craft-muted leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-craft-stone/20 border border-craft-sand/60">
                  <span className="text-craft-muted block">Material:</span>
                  <span className="font-semibold text-craft-charcoal">{product.material}</span>
                </div>
                <div className="p-3 rounded-xl bg-craft-stone/20 border border-craft-sand/60">
                  <span className="text-craft-muted block">Dimensions:</span>
                  <span className="font-semibold text-craft-charcoal">{product.size || 'Standard'}</span>
                </div>
              </div>

              {/* Authenticity Guarantee */}
              <div className="flex items-center gap-2 text-xs text-craft-forest">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verified Handcrafted • 100% Direct Artisan Support</span>
              </div>
            </div>

            {/* CTAs: Add to Cart & Buy Now */}
            <div className="pt-4 border-t border-craft-sand flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(product, 1);
                  onClose();
                }}
                className="w-1/2 py-3.5 px-4 rounded-xl border border-craft-terracotta text-craft-terracotta hover:bg-craft-terracotta/5 font-semibold text-xs shadow-craft-sm transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('btn.add_to_cart', 'Add to Cart')}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-1/2 py-3.5 px-4 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-semibold text-xs shadow-craft-md transition-colors flex items-center justify-center gap-2"
              >
                <span>{t('btn.buy_now', 'Buy Now')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
