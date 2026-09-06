import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { SafeImage } from '../common/SafeImage';
import {
  Plus,
  Sparkles,
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Tag,
} from 'lucide-react';

export const ArtisanDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, products, orders, deleteProduct, setActiveView, setSelectedProductForDetail } =
    useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Filter artisan's products and orders
  const myProducts = products.filter(
    (p) => p.artisanId === currentUser.id || currentUser.id === 'art-01'
  );

  const myOrders = orders.filter((o) =>
    o.artisanIds.includes(currentUser.id) || currentUser.id === 'art-01'
  );

  const totalEarnings = myOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Simple, Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-craft-sand pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-craft-charcoal">
            {t('artisan.greeting', 'Good morning 👋')} {currentUser.name || 'Artisan'}
          </h1>
          <p className="text-sm font-serif italic text-craft-terracotta">
            “{t('artisan.question', 'Ready to take your craft to the world?')}”
          </p>
        </div>

        {/* Main Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveView('artisan-add-product')}
            className="px-5 py-2.5 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-semibold shadow-craft-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btn.add_product', '+ Add Product')}</span>
          </button>

          <button
            onClick={() => setActiveView('artisan-add-product')}
            className="px-4 py-2.5 rounded-xl bg-white border border-craft-sand hover:border-craft-terracotta text-craft-charcoal text-xs font-semibold shadow-craft-sm flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-craft-terracotta" />
            <span>{t('btn.ai_studio', 'AI Product Studio')}</span>
          </button>
        </div>
      </div>

      {/* Useful Statistics Cards (Clean & minimal, no junk analytics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Products Published */}
        <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-craft-muted uppercase tracking-wider">
              {t('artisan.stat_published', 'Products Published')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-craft-terracotta/10 text-craft-terracotta flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-craft-charcoal">
            {myProducts.length}
          </div>
          <p className="text-[11px] text-craft-muted">Active in global marketplace</p>
        </div>

        {/* Orders Received */}
        <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-craft-muted uppercase tracking-wider">
              {t('artisan.stat_orders', 'Orders Received')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-craft-forest/10 text-craft-forest flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-craft-charcoal">
            {myOrders.length}
          </div>
          <p className="text-[11px] text-craft-muted">Direct from retail & bulk buyers</p>
        </div>

        {/* Total Earnings */}
        <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-craft-muted uppercase tracking-wider">
              {t('artisan.stat_earnings', 'Total Earnings')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-craft-brass/10 text-craft-brass flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-craft-charcoal">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-craft-forest font-medium">100% direct artisan payout</p>
        </div>
      </div>

      {/* Tabs: My Products vs My Orders */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-craft-sand">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
              activeTab === 'products'
                ? 'text-craft-terracotta'
                : 'text-craft-muted hover:text-craft-charcoal'
            }`}
          >
            <span>{t('artisan.my_products', 'My Products')} ({myProducts.length})</span>
            {activeTab === 'products' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
              activeTab === 'orders'
                ? 'text-craft-terracotta'
                : 'text-craft-muted hover:text-craft-charcoal'
            }`}
          >
            <span>{t('artisan.my_orders', 'My Orders')} ({myOrders.length})</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
            )}
          </button>
        </div>

        {/* Products Grid Tab */}
        {activeTab === 'products' && (
          <div>
            {myProducts.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-craft-sand text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-craft-stone text-craft-muted flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm text-craft-muted">
                  {t('artisan.no_products', 'No crafts published yet. Click Add Product to begin.')}
                </p>
                <button
                  onClick={() => setActiveView('artisan-add-product')}
                  className="px-5 py-2 rounded-xl bg-craft-terracotta text-white text-xs font-semibold"
                >
                  + Add Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-craft-sand overflow-hidden shadow-craft-sm hover:shadow-craft-md transition-shadow group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-52 relative overflow-hidden bg-craft-stone">
                        <SafeImage
                          src={product.enhancedImageUrl || product.originalImageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-craft-charcoal shadow-sm">
                          {product.category}
                        </div>
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Live
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-serif font-bold text-base text-craft-charcoal line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-xs text-craft-muted line-clamp-2">
                          {product.description}
                        </p>
                        <div className="text-xs text-craft-muted pt-1">
                          Material: <span className="font-medium text-craft-charcoal">{product.material}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-craft-sand/70 flex items-center justify-between">
                        <div className="text-base font-bold text-craft-charcoal">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedProductForDetail(product)}
                            className="p-2 rounded-lg text-craft-charcoal hover:bg-craft-stone text-xs flex items-center gap-1 border border-craft-sand"
                            title="View in Marketplace"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-craft-muted" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to remove this craft listing?')) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 text-xs"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {myOrders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-craft-sand text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-craft-stone text-craft-muted flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm text-craft-muted">
                  {t('artisan.no_orders', 'No orders yet. They will appear here when customers purchase your craft.')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-craft-sand/70 pb-3">
                      <div>
                        <span className="text-xs font-bold text-craft-terracotta">{order.id}</span>
                        <span className="text-xs text-craft-muted ml-2">
                          Placed by {order.customerName} on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-craft-forest/10 text-craft-forest">
                          {order.status}
                        </span>
                        <span className="text-sm font-bold text-craft-charcoal">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <SafeImage
                            src={item.product?.enhancedImageUrl || item.product?.originalImageUrl}
                            alt={item.product?.title || 'Craft'}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <div className="text-xs font-bold text-craft-charcoal line-clamp-1">
                              {item.product?.title}
                            </div>
                            <div className="text-xs text-craft-muted">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="text-xs text-craft-muted bg-craft-stone/30 p-3 rounded-xl">
                        <div className="font-semibold text-craft-charcoal mb-0.5">Shipping Destination:</div>
                        <div>{order.shippingAddress.fullName}</div>
                        <div>
                          {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </div>
                        <div>Phone: {order.shippingAddress.phone}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
