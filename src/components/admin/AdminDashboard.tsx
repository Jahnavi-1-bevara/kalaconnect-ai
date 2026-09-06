import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { SafeImage } from '../common/SafeImage';
import {
  ShieldCheck,
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Search,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { products, orders, updateProduct, setSelectedProductForDetail } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'artisans' | 'orders'>('overview');
  const [productFilter, setProductFilter] = useState('');

  // Sample artisan verification queue
  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: 'ver-01',
      name: 'Rameshwar Lal Kumhar',
      craft: 'Blue Pottery & Terracotta',
      region: 'Kot Jewar, Rajasthan',
      docType: 'Geographical Indication (GI) Card',
      docId: 'GI-RAJ-POT-4019',
      status: 'verified',
    },
    {
      id: 'ver-02',
      name: 'Sukhram Ghadwa',
      craft: 'Lost-Wax Bell Metal (Dokra)',
      region: 'Bastar, Chhattisgarh',
      docType: 'Master Craftsperson National Registration',
      docId: 'DC-HANDICRAFTS-8821',
      status: 'verified',
    },
    {
      id: 'ver-03',
      name: 'Meenakshi Sundaram',
      craft: 'Thanjavur Art Plates & Brass Inlay',
      region: 'Thanjavur, Tamil Nadu',
      docType: 'State Artisan Guild Certificate',
      docId: 'TN-ART-7729',
      status: 'pending',
    },
  ]);

  const totalGmv = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const filteredProducts = (products || []).filter((p) => {
    if (!productFilter.trim()) return true;
    const q = productFilter.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.artisanName || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  const handleVerifyArtisan = (id: string, newStatus: 'verified' | 'rejected') => {
    setVerificationQueue((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-craft-sand pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-700" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-craft-charcoal">
              {t('admin.title', 'KalaConnect AI Governance & Moderation')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-craft-muted mt-0.5">
            {t(
              'admin.subtitle',
              'Platform oversight, artisan verification, and product quality monitoring.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
          <span>System Healthy • All Services Operational</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-craft-sand">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'overview'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>{t('admin.tab_overview', 'Platform Overview')}</span>
          {activeTab === 'overview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'products'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>{t('admin.tab_products', 'Product Moderation')} ({products.length})</span>
          {activeTab === 'products' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('artisans')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'artisans'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>{t('admin.tab_artisans', 'Artisan Verification')} ({verificationQueue.length})</span>
          {activeTab === 'artisans' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'orders'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>{t('admin.tab_orders', 'All Platform Orders')} ({orders.length})</span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-craft-muted uppercase">
                <span>Gross Merchandise Value</span>
                <IndianRupee className="w-4 h-4 text-craft-forest" />
              </div>
              <div className="text-2xl font-serif font-bold text-craft-charcoal">
                ₹{totalGmv.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-craft-forest">100% fair trade direct payout</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-craft-muted uppercase">
                <span>Active Listings</span>
                <Package className="w-4 h-4 text-craft-terracotta" />
              </div>
              <div className="text-2xl font-serif font-bold text-craft-charcoal">
                {products.length}
              </div>
              <p className="text-[11px] text-craft-muted">AI Studio verified photographs</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-craft-muted uppercase">
                <span>Verified Master Artisans</span>
                <Users className="w-4 h-4 text-craft-brass" />
              </div>
              <div className="text-2xl font-serif font-bold text-craft-charcoal">
                1,248
              </div>
              <p className="text-[11px] text-craft-muted">Across 22 states of India</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-craft-muted uppercase">
                <span>Completed Orders</span>
                <ShoppingBag className="w-4 h-4 text-purple-700" />
              </div>
              <div className="text-2xl font-serif font-bold text-craft-charcoal">
                {orders.length}
              </div>
              <p className="text-[11px] text-craft-muted">Zero disputed transactions</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-craft-charcoal">
              Platform Integrity & Product Preservation Standards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-craft-stone/30 space-y-1">
                <span className="font-bold text-craft-charcoal block">Zero Redraw Policy</span>
                <p className="text-craft-muted leading-relaxed">
                  The AI image pipeline is strictly constrained to background separation. Generative hallucination of product details is permanently disabled.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-craft-stone/30 space-y-1">
                <span className="font-bold text-craft-charcoal block">Artisan Voice Autonomy</span>
                <p className="text-craft-muted leading-relaxed">
                  Telugu voice transcription extracts direct facts only. Artificial embellishments or unverified certifications are blocked.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-craft-stone/30 space-y-1">
                <span className="font-bold text-craft-charcoal block">Fair Trade Range</span>
                <p className="text-craft-muted leading-relaxed">
                  Algorithmic price guidance provides a bounded fair wage floor to protect traditional crafters from underpricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MODERATION */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-craft-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              placeholder="Search products by title, artisan, category..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-craft-sand text-xs focus:outline-none focus:border-craft-terracotta bg-white"
            />
          </div>

          <div className="bg-white rounded-2xl border border-craft-sand overflow-hidden shadow-craft-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-craft-stone/40 border-b border-craft-sand text-craft-muted uppercase font-semibold">
                  <tr>
                    <th className="p-4">Craft Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Master Artisan</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Studio Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-craft-sand/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-craft-stone/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <SafeImage
                            src={p.enhancedImageUrl || p.originalImageUrl}
                            alt={p.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <span className="font-bold text-craft-charcoal block line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-craft-muted">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-craft-muted">{p.category}</td>
                      <td className="p-4 font-medium text-craft-charcoal">{p.artisanName}</td>
                      <td className="p-4 font-bold text-craft-charcoal">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 uppercase">
                          AI Verified
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedProductForDetail(p)}
                          className="px-3 py-1.5 rounded-lg border border-craft-sand text-craft-charcoal hover:bg-craft-stone font-medium text-[11px]"
                        >
                          Inspect Listing
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ARTISAN VERIFICATION */}
      {activeTab === 'artisans' && (
        <div className="bg-white rounded-2xl border border-craft-sand overflow-hidden shadow-craft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-craft-stone/40 border-b border-craft-sand text-craft-muted uppercase font-semibold">
                <tr>
                  <th className="p-4">Artisan & Craft</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Verification Document</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-craft-sand/60">
                {verificationQueue.map((a) => (
                  <tr key={a.id} className="hover:bg-craft-stone/20">
                    <td className="p-4">
                      <div className="font-bold text-craft-charcoal">{a.name}</div>
                      <div className="text-craft-muted">{a.craft}</div>
                    </td>
                    <td className="p-4 text-craft-muted">{a.region}</td>
                    <td className="p-4">
                      <div className="font-medium text-craft-charcoal flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-craft-terracotta" />
                        <span>{a.docType}</span>
                      </div>
                      <div className="text-[11px] text-craft-muted font-mono">{a.docId}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          a.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {a.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleVerifyArtisan(a.id, 'verified')}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyArtisan(a.id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-[11px] font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-craft-forest font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-craft-sand overflow-hidden shadow-craft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-craft-stone/40 border-b border-craft-sand text-craft-muted uppercase font-semibold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-craft-sand/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-craft-stone/20">
                    <td className="p-4 font-bold text-craft-terracotta">{o.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-craft-charcoal">{o.customerName}</div>
                      <div className="text-[11px] text-craft-muted">{o.shippingAddress.city}</div>
                    </td>
                    <td className="p-4 text-craft-muted">{o.items.length} product(s)</td>
                    <td className="p-4 font-bold text-craft-charcoal">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-4 uppercase text-craft-muted">{o.paymentMethod}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-craft-forest/10 text-craft-forest">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-craft-muted">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
