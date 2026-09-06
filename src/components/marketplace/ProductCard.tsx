import React from 'react';
import { Product } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { useTranslation } from '../../i18n/LanguageContext';
import { Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onAddToCart,
}) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onViewProduct(product)}
      className="bg-white rounded-2xl border border-craft-sand overflow-hidden shadow-craft-sm hover:shadow-craft-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Product Image */}
        <div className="h-64 overflow-hidden relative bg-craft-stone">
          <SafeImage
            src={product.enhancedImageUrl || product.originalImageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-craft-charcoal shadow-sm">
            {product.category}
          </div>
        </div>

        {/* Product Information */}
        <div className="p-5 space-y-2">
          <h3 className="font-serif font-bold text-base text-craft-charcoal line-clamp-1 group-hover:text-craft-terracotta transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-craft-muted">
            {t('market.artisan_by', 'By')}{' '}
            <span className="font-medium text-craft-charcoal">{product.artisanName}</span>
            {product.artisanLocation ? ` • ${product.artisanLocation}` : ''}
          </p>

          <p className="text-xs text-craft-muted/80 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer / Card Actions */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-craft-sand/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-craft-muted block">Price</span>
            <span className="text-lg font-bold text-craft-charcoal">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onAddToCart && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="p-2 rounded-xl bg-craft-stone/60 hover:bg-craft-terracotta hover:text-white text-craft-charcoal transition-colors border border-craft-sand"
                title="Add to Cart"
                aria-label="Add to Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewProduct(product);
              }}
              className="px-3.5 py-2 rounded-xl bg-craft-charcoal text-white hover:bg-craft-terracotta text-xs font-semibold shadow-craft-sm transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('btn.view_product', 'View Product')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
