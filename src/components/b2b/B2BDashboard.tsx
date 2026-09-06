import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { SafeImage } from '../common/SafeImage';
import { B2BRequirement } from '../../types';
import {
  Building2,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const B2BDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, b2bRequirements, addB2BRequirement, products } = useApp();

  const [activeTab, setActiveTab] = useState<'requirements' | 'artisans' | 'proposals'>('requirements');
  const [showPostModal, setShowPostModal] = useState(false);

  // New requirement form
  const [reqTitle, setReqTitle] = useState('');
  const [reqCategory, setReqCategory] = useState('Pottery & Ceramics');
  const [reqQty, setReqQty] = useState(250);
  const [reqBudget, setReqBudget] = useState(650);
  const [reqDeliveryDate, setReqDeliveryDate] = useState('2026-11-20');
  const [reqDescription, setReqDescription] = useState('');

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    addB2BRequirement({
      buyerId: currentUser.id,
      companyName: currentUser.businessName || 'Corporate Procurement',
      title: reqTitle.trim(),
      category: reqCategory,
      quantityNeeded: reqQty,
      targetBudgetPerUnit: reqBudget,
      targetDeliveryDate: reqDeliveryDate,
      description: reqDescription.trim(),
    });

    setShowPostModal(false);
    setReqTitle('');
    setReqDescription('');
  };

  // Distinct artisan clusters derived from products
  const artisanClusters = [
    {
      id: 'cluster-1',
      name: 'Kot Jewar Terracotta & Blue Pottery Guild',
      location: 'Kot Jewar, Rajasthan',
      masterArtisan: 'Rameshwar Lal Kumhar',
      craft: 'Blue Pottery & Terracotta Water Jugs',
      capacity: '2,500 units / month',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cluster-2',
      name: 'Pochampally Handloom Weavers Cooperative',
      location: 'Bhoodan Pochampally, Telangana',
      masterArtisan: 'B. Lakshmi Narsimha',
      craft: 'Double-Ikat Silk & Cotton Sarees, Stoles',
      capacity: '800 pieces / month',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cluster-3',
      name: 'Bastar Bell Metal Craft Collective',
      location: 'Kondagaon, Bastar, Chhattisgarh',
      masterArtisan: 'Sukhram Ghadwa',
      craft: 'Lost-Wax Dokra Cast Brass Figures & Mementos',
      capacity: '600 sculptures / month',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cluster-4',
      name: 'Channapatna Artisans Guild',
      location: 'Channapatna, Karnataka',
      masterArtisan: 'Syed Mansoor',
      craft: 'GI-Tagged Lacquered Wood Toys & Corporate Gifting',
      capacity: '5,000 units / month',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-craft-sand pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-craft-brass" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-craft-charcoal">
              {t('b2b.title', 'B2B Bulk Craft Sourcing')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-craft-muted mt-0.5">
            {t(
              'b2b.subtitle',
              'Direct procurement from authentic artisan clusters for corporate gifting, hospitality & retail exports.'
            )}
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-5 py-2.5 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-semibold shadow-craft-sm flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Bulk Requirement</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-4 border-b border-craft-sand">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'requirements'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>Active Requirements ({b2bRequirements.length})</span>
          {activeTab === 'requirements' && (
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
          <span>Browse Artisan Clusters ({artisanClusters.length})</span>
          {activeTab === 'artisans' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === 'proposals'
              ? 'text-craft-terracotta'
              : 'text-craft-muted hover:text-craft-charcoal'
          }`}
        >
          <span>Cluster Proposals & Quotes</span>
          {activeTab === 'proposals' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-craft-terracotta rounded-full"></span>
          )}
        </button>
      </div>

      {/* Requirements Tab */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {b2bRequirements.map((req) => (
            <div
              key={req.id}
              className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-craft-sand/70 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-craft-terracotta uppercase">
                      {req.category}
                    </span>
                    <span className="text-craft-sand">•</span>
                    <span className="text-xs text-craft-muted">Posted {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-craft-charcoal mt-1">
                    {req.title}
                  </h3>
                  <div className="text-xs text-craft-muted">Posted by: {req.companyName}</div>
                </div>

                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-craft-forest/10 text-craft-forest self-start">
                  {req.status}
                </span>
              </div>

              <p className="text-xs text-craft-charcoal leading-relaxed">{req.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-craft-stone/20">
                  <span className="text-craft-muted block">Quantity:</span>
                  <span className="font-bold text-craft-charcoal">{req.quantityNeeded} Units</span>
                </div>
                <div className="p-3 rounded-xl bg-craft-stone/20">
                  <span className="text-craft-muted block">Target Budget:</span>
                  <span className="font-bold text-craft-charcoal">₹{req.targetBudgetPerUnit} / Unit</span>
                </div>
                <div className="p-3 rounded-xl bg-craft-stone/20">
                  <span className="text-craft-muted block">Delivery By:</span>
                  <span className="font-bold text-craft-charcoal">{req.targetDeliveryDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-craft-forest/10">
                  <span className="text-craft-forest block">Proposals Received:</span>
                  <span className="font-bold text-craft-forest">{req.proposalsCount || 2} Artisan Clusters</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artisan Clusters Tab */}
      {activeTab === 'artisans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artisanClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="p-6 rounded-2xl bg-white border border-craft-sand shadow-craft-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={cluster.imageUrl}
                    alt={cluster.name}
                    className="w-16 h-16 rounded-xl object-cover border border-craft-sand shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-sm text-craft-charcoal">
                        {cluster.name}
                      </h4>
                      {cluster.verified && (
                        <ShieldCheck className="w-4 h-4 text-craft-forest shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-craft-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-craft-terracotta" />
                      <span>{cluster.location}</span>
                    </p>
                    <p className="text-xs text-craft-charcoal font-medium mt-0.5">
                      Master Artisan: {cluster.masterArtisan}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-craft-muted">Craft Specialization:</div>
                  <div className="font-medium text-craft-charcoal">{cluster.craft}</div>
                </div>

                <div className="p-3 rounded-xl bg-craft-stone/30 text-xs flex justify-between">
                  <span className="text-craft-muted">Monthly Cluster Capacity:</span>
                  <span className="font-bold text-craft-charcoal">{cluster.capacity}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-craft-sand/70 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert(`RFQ message drafted to ${cluster.masterArtisan}. Direct artisan contact verified.`)}
                  className="w-full py-2.5 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-semibold shadow-craft-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Cluster Quotation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proposals Tab */}
      {activeTab === 'proposals' && (
        <div className="p-10 rounded-3xl bg-white border border-craft-sand text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-craft-stone text-craft-muted flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-craft-charcoal">
              3 Active Cluster Proposals Received
            </h3>
            <p className="text-xs text-craft-muted max-w-md mx-auto">
              Artisan clusters have submitted batch samples, verified GI certifications, and delivery timetables for your active requirements.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fair Trade Direct Contract Terms Ready</span>
          </div>
        </div>
      )}

      {/* Post Requirement Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-craft-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-craft-sand shadow-craft-xl space-y-6">
            <div className="flex items-center justify-between border-b border-craft-sand pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-craft-charcoal">
                  Post Bulk Sourcing Requirement
                </h3>
                <p className="text-xs text-craft-muted">
                  Connect directly with verified artisanal production clusters.
                </p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-craft-muted hover:text-craft-charcoal text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-craft-charcoal block mb-1">
                  Requirement Title *
                </label>
                <input
                  type="text"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g., 500 Terracotta Bottles with customized hotel branding"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-craft-sand focus:outline-none focus:border-craft-terracotta text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-craft-charcoal block mb-1">
                    Craft Category
                  </label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand focus:outline-none focus:border-craft-terracotta text-xs bg-white"
                  >
                    <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                    <option value="Handloom & Textiles">Handloom & Textiles</option>
                    <option value="Wood Carving">Wood Carving</option>
                    <option value="Metal & Brass Craft">Metal & Brass Craft</option>
                    <option value="Bamboo & Cane">Bamboo & Cane</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-craft-charcoal block mb-1">
                    Quantity Needed
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={reqQty}
                    onChange={(e) => setReqQty(parseInt(e.target.value) || 50)}
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand focus:outline-none focus:border-craft-terracotta text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-craft-charcoal block mb-1">
                    Target Budget / Unit (₹)
                  </label>
                  <input
                    type="number"
                    value={reqBudget}
                    onChange={(e) => setReqBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand focus:outline-none focus:border-craft-terracotta text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-craft-charcoal block mb-1">
                    Target Delivery Date
                  </label>
                  <input
                    type="date"
                    value={reqDeliveryDate}
                    onChange={(e) => setReqDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand focus:outline-none focus:border-craft-terracotta text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-craft-charcoal block mb-1">
                  Specifications & Details
                </label>
                <textarea
                  rows={3}
                  value={reqDescription}
                  onChange={(e) => setReqDescription(e.target.value)}
                  placeholder="Describe material requirements, custom finishes, or packaging guidelines..."
                  className="w-full px-3 py-2 rounded-xl border border-craft-sand focus:outline-none focus:border-craft-terracotta text-xs"
                />
              </div>

              <div className="pt-4 border-t border-craft-sand flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-craft-sand hover:bg-craft-stone text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-semibold shadow-craft-sm"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
