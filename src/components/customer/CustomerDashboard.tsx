import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { SafeImage } from '../common/SafeImage';
import { ShoppingBag, Heart, Package, Sparkles, Clock, CheckCircle2, ChevronRight, User } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, orders, products, setActiveView, setSelectedProductForDetail, setIsCartOpen } =
    useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'recommended' | 'profile'>('orders');

  const myOrders = orders.filter((o) => o.customerId === currentUser.id || o.customerId === 'cust-01');
  const recommendedCrafts = products.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-craft-sand pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-craft-charcoal">
            Welcome back, {currentUser.name || 'Conscious Collector'}
          </h1>
          <p className="text-xs sm:text-sm text-craft-muted mt-0.5">
            Empowering traditional artisan clusters with every direct purchase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('marketplace')}
            className="px-4 py-2 rounded-xl bg-craft-terracotta text-white text-xs font-semibold shadow-craft-sm hover:bg-craft-terracotta-dark transition-colors"
          >
            Explore Marketplace
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-xl border border-craft-sand bg-white text-craft-charcoal text-xs font-semibold hover:bg-craft-stone transition-colors flex items-center gap-1.5 shadow-craft-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-craft-terracotta" />
            <span>Open Bag</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-craft-sand">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
            activeSubTab === 'orders'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>{t('nav.my_orders', 'My Orders')} ({myOrders.length})</span>
          {activeSubTab === 'orders' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('recommended')}
          className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
            activeSubTab === 'recommended'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>Recommended For You</span>
          {activeSubTab === 'recommended' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
            activeSubTab === 'profile'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>My Profile</span>
          {activeSubTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>
      </div>

      {/* Orders View */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-craft-sand text-center space-y-3">
              <Package className="w-10 h-10 text-craft-muted mx-auto" />
              <p className="text-sm font-serif font-bold text-craft-charcoal">
                You have no orders yet.
              </p>
              <p className="text-xs text-craft-muted">
                Explore our authentic artisan marketplace to find unique handcrafted items.
              </p>
              <button
                onClick={() => setActiveView('marketplace')}
                className="px-5 py-2 rounded-xl bg-craft-terracotta text-white text-xs font-semibold"
              >
                Browse Crafts
              </button>
            </div>
          ) : (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-craft-sand/70 pb-3">
                  <div>
                    <span className="text-xs font-bold text-craft-terracotta">{order.id}</span>
                    <span className="text-xs text-craft-muted ml-2">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
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

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedProductForDetail(item.product)}
                      className="flex items-center justify-between p-3 rounded-xl bg-craft-stone/20 hover:bg-craft-stone/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
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
                            By {item.product?.artisanName} • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-craft-charcoal">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs text-craft-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-craft-sand/70">
                  <div>
                    Shipping to: <strong className="text-craft-charcoal">{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state})
                  </div>
                  <div className="text-craft-forest font-medium">
                    Direct Payout Transferred to Artisan
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Recommended Crafts */}
      {activeSubTab === 'recommended' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCrafts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProductForDetail(product)}
              className="bg-white rounded-2xl border border-craft-sand overflow-hidden shadow-craft-sm hover:shadow-craft-md transition-all cursor-pointer group"
            >
              <div className="h-48 overflow-hidden relative bg-craft-stone">
                <SafeImage
                  src={product.enhancedImageUrl || product.originalImageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-[10px] font-semibold text-craft-terracotta uppercase">
                  {product.category}
                </div>
                <h4 className="font-serif font-bold text-sm text-craft-charcoal line-clamp-1">
                  {product.title}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-craft-charcoal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-craft-terracotta">View →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Info */}
      {activeSubTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 rounded-2xl border border-craft-sand shadow-craft-sm space-y-4">
          <div className="flex items-center gap-4 border-b border-craft-sand/70 pb-4">
            <div className="w-14 h-14 rounded-full bg-craft-forest/10 text-craft-forest flex items-center justify-center font-bold text-xl">
              {currentUser.name ? currentUser.name[0] : 'C'}
            </div>
            <div>
              <div className="text-base font-bold text-craft-charcoal">{currentUser.name}</div>
              <div className="text-xs text-craft-muted">{currentUser.email}</div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-craft-forest/10 text-craft-forest uppercase">
                Customer Account
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-craft-sand/50">
              <span className="text-craft-muted">Delivery Location:</span>
              <span className="font-medium text-craft-charcoal">{currentUser.location || 'Bengaluru, India'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-craft-sand/50">
              <span className="text-craft-muted">Contact Phone:</span>
              <span className="font-medium text-craft-charcoal">{currentUser.phone || '+91 98450 67890'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-craft-muted">Fair Trade Badge:</span>
              <span className="font-semibold text-craft-forest">Verified Conscious Supporter</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
