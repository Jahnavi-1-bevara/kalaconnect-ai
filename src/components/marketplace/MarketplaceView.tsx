import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { t } = useTranslation();
  const { products, addToCart, setSelectedProductForDetail } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');

  const categories = [
    'All',
    'Pottery & Ceramics',
    'Handloom & Textiles',
    'Wood Carving',
    'Metal & Brass Craft',
    'Bamboo & Cane',
    'Artisanal Jewelry',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const artisanMatch = (p.artisanName || '').toLowerCase().includes(q);
        const materialMatch = (p.material || '').toLowerCase().includes(q);
        return titleMatch || descMatch || artisanMatch || materialMatch;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Marketplace Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-craft-charcoal">
          {t('market.title', 'Handcrafted Treasures of India')}
        </h1>
        <p className="text-xs sm:text-sm text-craft-muted">
          {t(
            'market.subtitle',
            'Directly from master artisans across India. Fair trade, verified authentic, sustainably made.'
          )}
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-craft-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                'market.search_placeholder',
                'Search crafts, pottery, handloom, wooden art...'
              )}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta bg-white shadow-craft-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-craft-muted hover:text-craft-charcoal"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-craft-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-3 rounded-2xl border border-craft-sand text-xs font-medium text-craft-charcoal bg-white focus:outline-none shadow-craft-sm"
            >
              <option value="featured">Featured Crafts</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-craft-terracotta text-white shadow-craft-sm font-semibold'
                    : 'bg-white border border-craft-sand text-craft-charcoal/80 hover:bg-craft-stone'
                }`}
              >
                {cat === 'All' ? t('market.all_categories', 'All Categories') : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-craft-sand text-center space-y-3">
          <p className="text-sm font-serif font-bold text-craft-charcoal">
            {t('market.no_results', 'No crafts found matching your search.')}
          </p>
          <p className="text-xs text-craft-muted">
            Try resetting your search query or choosing a different craft category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-craft-stone text-xs font-medium text-craft-charcoal hover:bg-craft-sand"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={(p) => setSelectedProductForDetail(p)}
              onAddToCart={(p) => addToCart(p, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
