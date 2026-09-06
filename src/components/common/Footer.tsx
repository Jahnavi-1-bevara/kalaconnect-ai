import React from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-craft-charcoal text-craft-sand border-t border-craft-charcoal/40 pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-craft-sand/15">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-craft-terracotta flex items-center justify-center text-white font-serif font-bold text-lg">
                K
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                KalaConnect <span className="text-xs uppercase font-sans font-bold bg-craft-terracotta/30 text-craft-terracotta px-1.5 py-0.5 rounded">AI</span>
              </span>
            </div>
            <p className="font-serif italic text-sm text-craft-sand/80">
              “{t('brand.tagline', 'From Your Craft to the World.')}”
            </p>
            <p className="text-xs text-craft-sand/60 leading-relaxed">
              Empowering India’s master artisans through computer vision AI photography, regional voice technology, and fair-trade global market connections.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Artisan Pillars</h4>
            <ul className="space-y-2 text-xs text-craft-sand/70">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-craft-terracotta" />
                <span>AI Product Photography</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-craft-terracotta" />
                <span>Telugu & Regional Voice Input</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-craft-terracotta" />
                <span>Fair Price Range Estimation</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-craft-terracotta" />
                <span>Zero Intermediary Margins</span>
              </li>
            </ul>
          </div>

          {/* Craft Clusters */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Featured Craft Heritage</h4>
            <ul className="space-y-1.5 text-xs text-craft-sand/70">
              <li>Jaipur Blue Pottery (Rajasthan)</li>
              <li>Pochampally Ikat Handlooms (Telangana)</li>
              <li>Bastar Dokra Metal Casting (Chhattisgarh)</li>
              <li>Channapatna Wooden Toys (Karnataka)</li>
              <li>Gorakhpur Terracotta Craft (Uttar Pradesh)</li>
              <li>Assam Handwoven Bamboo (Assam)</li>
            </ul>
          </div>

          {/* Direct Commerce */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Market Channels</h4>
            <p className="text-xs text-craft-sand/70 leading-relaxed">
              Serving conscious retail collectors worldwide and direct B2B bulk sourcing for luxury hotels, interior designers, and corporate gifting.
            </p>
            <div className="p-3 rounded-lg bg-craft-sand/10 border border-craft-sand/15 text-[11px] text-craft-sand/90">
              <span className="font-semibold text-white">100% Artisan Preserved:</span> Every product photograph retains 100% original craft pixel fidelity.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-craft-sand/50 gap-4">
          <p>© 2026 KalaConnect AI Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Ethical Craft Code</span>
            <span>Artisan Privacy</span>
            <span>Fair Trade Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
