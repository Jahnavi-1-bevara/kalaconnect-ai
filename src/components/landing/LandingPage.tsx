import React from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { SafeImage } from '../common/SafeImage';
import {
  Sparkles,
  Mic,
  Globe2,
  Building2,
  Camera,
  Layers,
  BookOpen,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { setActiveView, products, setSelectedProductForDetail, switchRole } = useApp();

  const featured = products.slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 overflow-hidden">
        {/* Subtle warm decorative craft gradient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-craft-terracotta/15 rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-1/4 w-80 h-80 bg-craft-brass/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-craft-stone border border-craft-sand text-xs font-medium text-craft-charcoal shadow-craft-sm">
                <span className="w-2 h-2 rounded-full bg-craft-terracotta animate-pulse"></span>
                <span>Empowering 10,000+ Indian Artisans Online</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl font-serif font-bold text-craft-charcoal tracking-tight leading-[1.15]">
                  KalaConnect AI
                  <span className="block mt-2 font-serif italic text-craft-terracotta font-normal text-3xl sm:text-5xl">
                    “{t('brand.tagline', 'From Your Craft to the World.')}”
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-craft-muted max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                  {t(
                    'brand.hero_sub',
                    'Turn your handmade craft into a professional product listing with AI-powered photography, catalog creation and market access.'
                  )}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    switchRole('artisan');
                    setActiveView('artisan-add-product');
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-medium text-base shadow-craft-md hover:shadow-craft-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{t('btn.get_started', 'Get Started')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setActiveView('marketplace')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-craft-stone text-craft-charcoal font-medium text-base border border-craft-sand shadow-craft-sm transition-colors flex items-center justify-center"
                >
                  {t('btn.explore_crafts', 'Explore Handicrafts')}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-craft-sand/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-craft-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-craft-forest" />
                  <span>Product Preservation Rule</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-craft-forest" />
                  <span>Telugu Voice-to-Catalog</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-craft-forest" />
                  <span>Fair Trade Transparent Pricing</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Authentic Indian Craft in Studio Lighting */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-craft-xl border-4 border-white bg-craft-stone">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85"
                    alt="Handmade Indian Pottery"
                    className="w-full h-[420px] sm:h-[480px] object-cover"
                  />

                  {/* Floating AI Studio Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-craft-md border border-craft-sand flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-craft-terracotta" />
                    <span className="text-xs font-semibold text-craft-charcoal">AI Studio Enhanced</span>
                  </div>

                  {/* Floating Craft Attribution Card */}
                  <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-craft-lg border border-craft-sand">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-craft-terracotta uppercase tracking-wider">
                          Jaipur Blue Pottery
                        </div>
                        <div className="text-sm font-serif font-bold text-craft-charcoal">
                          Hand-Painted Floral Ceramic Vase
                        </div>
                        <div className="text-xs text-craft-muted">
                          By Rameshwar Lal Kumhar, Rajasthan
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-craft-muted line-through">₹1,800</div>
                        <div className="text-base font-bold text-craft-charcoal">₹1,450</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative background shape */}
                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-craft-sand/60 rounded-3xl -z-10 transform rotate-6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section (Below Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white p-7 rounded-2xl border border-craft-sand shadow-craft-sm hover:shadow-craft-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-craft-terracotta/10 text-craft-terracotta flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-craft-charcoal font-serif">
              {t('landing.benefit1_title', 'AI Product Photography')}
            </h3>
            <p className="text-xs text-craft-muted leading-relaxed">
              {t(
                'landing.benefit1_desc',
                'Instantly isolates your craft and places it in museum-grade, photorealistic studio lighting.'
              )}
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-7 rounded-2xl border border-craft-sand shadow-craft-sm hover:shadow-craft-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-craft-brass/10 text-craft-brass flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-craft-charcoal font-serif">
              {t('landing.benefit2_title', 'Voice-Powered Catalog Creation')}
            </h3>
            <p className="text-xs text-craft-muted leading-relaxed">
              {t(
                'landing.benefit2_desc',
                'Simply speak naturally in Telugu to describe your craft. AI transcribes, translates, and formats specs.'
              )}
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-7 rounded-2xl border border-craft-sand shadow-craft-sm hover:shadow-craft-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-craft-forest/10 text-craft-forest flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-craft-charcoal font-serif">
              {t('landing.benefit3_title', 'Marketplace Access')}
            </h3>
            <p className="text-xs text-craft-muted leading-relaxed">
              {t(
                'landing.benefit3_desc',
                'Reach conscious global buyers directly with zero intermediaries and fair trade pricing.'
              )}
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white p-7 rounded-2xl border border-craft-sand shadow-craft-sm hover:shadow-craft-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-craft-clay/10 text-craft-clay flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-craft-charcoal font-serif">
              {t('landing.benefit4_title', 'B2B Market Connections')}
            </h3>
            <p className="text-xs text-craft-muted leading-relaxed">
              {t(
                'landing.benefit4_desc',
                'Connect directly with boutique hotels, interior designers, and corporate bulk gifting buyers.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-craft-stone/60 border-y border-craft-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-craft-charcoal">
              {t('landing.steps_title', 'How It Works')}
            </h2>
            <p className="text-sm text-craft-muted">
              Four simple, transparent steps connecting master artisan workshops to global collectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-craft-sand shadow-craft-sm relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-craft-terracotta text-white font-bold text-sm flex items-center justify-center shadow-craft-sm">
                1
              </div>
              <h4 className="text-base font-bold text-craft-charcoal font-serif flex items-center gap-2">
                <Camera className="w-4 h-4 text-craft-terracotta" />
                <span>{t('landing.step1_title', 'Capture Your Craft')}</span>
              </h4>
              <p className="text-xs text-craft-muted leading-relaxed">
                {t(
                  'landing.step1_desc',
                  'Snap a photo of your craft in your workshop with any mobile phone or upload an existing picture.'
                )}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-craft-sand shadow-craft-sm relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-craft-terracotta text-white font-bold text-sm flex items-center justify-center shadow-craft-sm">
                2
              </div>
              <h4 className="text-base font-bold text-craft-charcoal font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-craft-terracotta" />
                <span>{t('landing.step2_title', 'Enhance with AI')}</span>
              </h4>
              <p className="text-xs text-craft-muted leading-relaxed">
                {t(
                  'landing.step2_desc',
                  'Real AI cutout removes background clutter while strictly preserving 100% of your product details.'
                )}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-craft-sand shadow-craft-sm relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-craft-terracotta text-white font-bold text-sm flex items-center justify-center shadow-craft-sm">
                3
              </div>
              <h4 className="text-base font-bold text-craft-charcoal font-serif flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-craft-terracotta" />
                <span>{t('landing.step3_title', 'Create Your Catalog')}</span>
              </h4>
              <p className="text-xs text-craft-muted leading-relaxed">
                {t(
                  'landing.step3_desc',
                  'Describe in Telugu or type details; get instant price range guidance and professional descriptions.'
                )}
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-craft-sand shadow-craft-sm relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-craft-terracotta text-white font-bold text-sm flex items-center justify-center shadow-craft-sm">
                4
              </div>
              <h4 className="text-base font-bold text-craft-charcoal font-serif flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-craft-terracotta" />
                <span>{t('landing.step4_title', 'Reach Customers')}</span>
              </h4>
              <p className="text-xs text-craft-muted leading-relaxed">
                {t(
                  'landing.step4_desc',
                  'Publish to retail buyers worldwide or connect with high-volume verified B2B bulk purchase orders.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Handicrafts Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-craft-charcoal">
              Featured Handicrafts
            </h2>
            <p className="text-sm text-craft-muted mt-1">
              Photographed and cataloged using KalaConnect AI Studio.
            </p>
          </div>
          <button
            onClick={() => setActiveView('marketplace')}
            className="text-xs font-semibold text-craft-terracotta hover:text-craft-terracotta-dark flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Crafts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProductForDetail(product);
              }}
              className="bg-white rounded-2xl border border-craft-sand overflow-hidden shadow-craft-sm hover:shadow-craft-md transition-all cursor-pointer group"
            >
              <div className="h-64 overflow-hidden relative bg-craft-stone">
                <SafeImage
                  src={product.enhancedImageUrl || product.originalImageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-craft-charcoal shadow-sm">
                  {product.category}
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-1 text-xs text-craft-brass">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold text-craft-charcoal">{product.rating || 4.9}</span>
                  <span className="text-craft-muted">({product.reviewsCount || 20})</span>
                </div>
                <h3 className="font-serif font-bold text-base text-craft-charcoal line-clamp-1 group-hover:text-craft-terracotta transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-craft-muted">
                  By {product.artisanName} • {product.artisanLocation}
                </p>
                <div className="pt-2 border-t border-craft-sand/60 flex items-center justify-between">
                  <div className="text-lg font-bold text-craft-charcoal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs font-semibold text-craft-terracotta">View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
