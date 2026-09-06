import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { Product } from '../../types';
import { AIProductStudio } from './AIProductStudio';
import { TeluguVoiceInput } from './TeluguVoiceInput';
import { calculateSuggestedPriceRange } from '../../services/pricingEngine';
import {
  TeluguVoiceService,
  extractCostAndEffortFromVoice,
  ExtractedCostAndEffort,
} from '../../services/voiceRecognition';
import { SafeImage } from '../common/SafeImage';
import {
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Tag,
  ArrowRight,
  ArrowLeft,
  X,
  Clock,
  Hammer,
  Mic,
  MicOff,
  Coins,
  RefreshCw,
  AlertCircle,
  Edit3,
  Check,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_RAW_PHOTOS = [
  {
    name: 'Black Computer Mouse (Cardboard / Package Background)',
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    category: 'Minimal Tech & Product Studio',
    material: 'Ergonomic Matte Polycarbonate',
  },
  {
    name: 'Handmade Terracotta Pitcher (Raw Workshop Table)',
    url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    category: 'Pottery & Ceramics',
    material: 'Natural Earthen Clay',
  },
  {
    name: 'Handloom Silk Textile / Saree (Weaving Shed)',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    category: 'Handloom & Textiles',
    material: 'Pure Mulberry Silk',
  },
  {
    name: 'Handcrafted Wooden Carving (Workshop Table)',
    url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    category: 'Wood Carving',
    material: 'Ivory Wood & Organic Lacquer',
  },
  {
    name: 'Woven Bamboo Storage Basket (Craft Shed)',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    category: 'Bamboo & Cane',
    material: 'Natural Forest Bamboo',
  },
  {
    name: 'Traditional Silver Artisanal Jewelry (Display Bench)',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    category: 'Artisanal Jewelry',
    material: 'Sterling Silver & Semiprecious Stones',
  },
];

export const AddProductWizard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, addProduct, setActiveView } = useApp();

  // Step state: 1 = Photo, 2 = AI Studio, 3 = Catalog & Pricing
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Photo state
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // AI Studio enhanced results
  const [studioResult, setStudioResult] = useState<{
    enhancedImageUrl: string;
    cutoutImageUrl: string;
    backgroundStyle: string;
  } | null>(null);

  // Form & Catalog state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pottery & Ceramics');
  const [material, setMaterial] = useState('Natural Terracotta Clay');
  const [craftType, setCraftType] = useState('Handmade / Handcrafted');
  const [makingTime, setMakingTime] = useState('3 days');
  const [size, setSize] = useState('Medium (8" × 5")');
  const [price, setPrice] = useState<number>(950);
  const [stock, setStock] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [teluguOriginal, setTeluguOriginal] = useState('');
  const [materialCost, setMaterialCost] = useState<number | undefined>(undefined);
  const [laborCost, setLaborCost] = useState<number | undefined>(undefined);
  const [laborHours, setLaborHours] = useState<number | undefined>(undefined);
  const [packagingCost, setPackagingCost] = useState<number | undefined>(undefined);
  const [otherCosts, setOtherCosts] = useState<number | undefined>(undefined);
  const [artisanCurrentPrice, setArtisanCurrentPrice] = useState<number | undefined>(undefined);
  const [isVoiceExtracted, setIsVoiceExtracted] = useState(false);
  const [isCostVoiceExtracted, setIsCostVoiceExtracted] = useState(false);
  const [costVoiceRecording, setCostVoiceRecording] = useState(false);
  const [costVoiceTranscript, setCostVoiceTranscript] = useState('');
  const [costVoiceMessage, setCostVoiceMessage] = useState('');
  const [lastExtractedCost, setLastExtractedCost] = useState<ExtractedCostAndEffort | null>(null);
  const [isEditingCostTranscript, setIsEditingCostTranscript] = useState(false);
  const [editedCostTranscript, setEditedCostTranscript] = useState('');
  const [costVoiceLanguage, setCostVoiceLanguage] = useState<'en-IN' | 'te-IN'>('en-IN');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const costVoiceRef = useRef<TeluguVoiceService | null>(null);

  // Price range calculation
  const priceRange = calculateSuggestedPriceRange({
    category,
    material,
    craftType,
    makingTime,
    size,
    baseMaterialCost: materialCost,
    materialCost,
    laborCost,
    laborHours,
    packagingCost,
    otherCosts,
    artisanCurrentPrice,
  });

  // Camera cleanup
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleStartCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert('Camera access unavailable. You can upload an image or choose a demo craft photo.');
      setCameraActive(false);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImageUrl(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceData = (data: {
    title: string;
    description: string;
    category: string;
    material: string;
    craftType: string;
    makingTime: string;
    teluguOriginal?: string;
  }) => {
    if (data.title) setTitle(data.title);
    if (data.description) setDescription(data.description);
    if (data.category) setCategory(data.category);
    if (data.material) setMaterial(data.material);
    if (data.craftType) setCraftType(data.craftType);
    if (data.makingTime) setMakingTime(data.makingTime);
    if (data.teluguOriginal) setTeluguOriginal(data.teluguOriginal);
    setIsVoiceExtracted(true);
  };

  const applyExtractedCostDetails = (extracted: ExtractedCostAndEffort) => {
    let newMat = materialCost;
    let newLab = laborCost;
    let newLabHours = laborHours;
    let newPack = packagingCost;
    let newOther = otherCosts;
    let newArtisanPrice = artisanCurrentPrice;
    let newMakingTime = makingTime;

    if (extracted.materialCost !== undefined) {
      newMat = extracted.materialCost;
      setMaterialCost(newMat);
    }
    if (extracted.laborCost !== undefined) {
      newLab = extracted.laborCost;
      setLaborCost(newLab);
    }
    if (extracted.laborHours !== undefined) {
      newLabHours = extracted.laborHours;
      setLaborHours(newLabHours);
    }
    if (extracted.packagingCost !== undefined) {
      newPack = extracted.packagingCost;
      setPackagingCost(newPack);
    }
    if (extracted.otherCosts !== undefined) {
      newOther = extracted.otherCosts;
      setOtherCosts(newOther);
    }
    if (extracted.existingPrice !== undefined) {
      newArtisanPrice = extracted.existingPrice;
      setArtisanCurrentPrice(newArtisanPrice);
    }
    if (extracted.makingTime) {
      newMakingTime = extracted.makingTime;
      setMakingTime(newMakingTime);
    }

    setIsCostVoiceExtracted(true);
    setCostVoiceMessage(extracted.explanation);

    const newRange = calculateSuggestedPriceRange({
      category,
      material,
      craftType,
      makingTime: newMakingTime,
      size,
      materialCost: newMat,
      laborCost: newLab,
      laborHours: newLabHours,
      packagingCost: newPack,
      otherCosts: newOther,
      artisanCurrentPrice: newArtisanPrice,
      isIntricate: extracted.isIntricate,
    });
    setPrice(newRange.recommendedPrice || newRange.min);
  };

  const processCostSpeech = (text: string) => {
    setCostVoiceTranscript(text);
    setEditedCostTranscript(text);
    setIsEditingCostTranscript(false);

    const extracted = extractCostAndEffortFromVoice(text);
    setLastExtractedCost(extracted);
    applyExtractedCostDetails(extracted);
  };

  const handleRecalculatePrice = () => {
    const newRange = calculateSuggestedPriceRange({
      category,
      material,
      craftType,
      makingTime,
      size,
      materialCost,
      laborCost,
      laborHours,
      packagingCost,
      otherCosts,
      artisanCurrentPrice,
    });
    setPrice(newRange.recommendedPrice || newRange.min);
  };

  const handleStartCostListening = () => {
    if (!costVoiceRef.current) {
      costVoiceRef.current = new TeluguVoiceService(costVoiceLanguage);
    } else {
      costVoiceRef.current.setLanguage(costVoiceLanguage);
    }
    setCostVoiceRecording(true);
    costVoiceRef.current.startListening(
      (text) => {
        processCostSpeech(text);
      },
      () => {
        setCostVoiceRecording(false);
      },
      () => {
        setCostVoiceRecording(false);
      },
      costVoiceLanguage
    );
  };

  const handleStopCostListening = () => {
    if (costVoiceRef.current) {
      costVoiceRef.current.stopListening();
    }
    setCostVoiceRecording(false);
  };

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Please provide a product title.');
      return;
    }

    setIsPublishing(true);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: title.trim(),
      category: category || 'Indian Handicrafts',
      material: material || 'Artisanal Natural Material',
      craftType: craftType || 'Handmade / Handcrafted',
      makingTime: makingTime || '3 days',
      size: size || 'Standard',
      price: price || priceRange.recommendedPrice || priceRange.min,
      suggestedPriceRange: priceRange,
      rawMaterialCost: materialCost,
      laborCost: laborCost,
      laborHours: laborHours,
      packagingCost: packagingCost,
      otherProductionCost: otherCosts,
      artisanCurrentPrice: artisanCurrentPrice,
      recommendedPrice: priceRange.recommendedPrice,
      description:
        description.trim() ||
        'Handcrafted piece created with care by regional master artisans.',
      teluguOriginal: teluguOriginal || undefined,
      originalImageUrl: selectedImageUrl,
      enhancedImageUrl: studioResult?.enhancedImageUrl || selectedImageUrl,
      cutoutImageUrl: studioResult?.cutoutImageUrl,
      backgroundStyle: studioResult?.backgroundStyle || 'smart-match',
      artisanId: currentUser.id,
      artisanName: currentUser.name || 'Master Artisan',
      artisanLocation: currentUser.location || 'India',
      status: 'published',
      createdAt: new Date().toISOString(),
      stock: stock || 5,
      rating: 5.0,
      reviewsCount: 1,
    };

    addProduct(newProduct);
    setIsPublishing(false);
    setPublishedSuccess(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }
  };

  if (publishedSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-craft-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-craft-charcoal">
            Craft Successfully Published!
          </h2>
          <p className="text-sm text-craft-muted max-w-md mx-auto">
            Your handcrafted item is now live in the KalaConnect Marketplace with studio photography and transparent fair pricing.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-craft-sand shadow-craft-sm max-w-sm mx-auto flex items-center gap-3 text-left">
          <SafeImage
            src={studioResult?.enhancedImageUrl || selectedImageUrl}
            alt={title}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div>
            <div className="text-xs font-semibold text-craft-terracotta">{category}</div>
            <div className="text-sm font-bold text-craft-charcoal line-clamp-1">{title}</div>
            <div className="text-xs font-bold text-craft-charcoal">₹{price.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <button
            onClick={() => setActiveView('marketplace')}
            className="px-6 py-3 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-semibold shadow-craft-md transition-colors"
          >
            View in Marketplace →
          </button>
          <button
            onClick={() => setActiveView('artisan-dashboard')}
            className="px-6 py-3 rounded-xl bg-white border border-craft-sand text-craft-charcoal hover:bg-craft-stone text-xs font-semibold shadow-craft-sm"
          >
            Go to Artisan Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-craft-sand pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('artisan-dashboard')}
            className="p-2 rounded-xl text-craft-muted hover:text-craft-charcoal hover:bg-craft-stone"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-craft-charcoal">
              {t('add_product.title', 'Add New Handicraft')}
            </h1>
            <p className="text-xs text-craft-muted">
              {currentStep === 1 && t('add_product.step1_desc', 'Upload or capture a photo of your handmade craft.')}
              {currentStep === 2 && 'Real AI background removal & studio photography enhancement.'}
              {currentStep === 3 && t('add_product.step2_desc', 'Provide information in Telugu or English to generate your catalog.')}
            </p>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span
            className={`px-3 py-1 rounded-full ${
              currentStep === 1
                ? 'bg-craft-terracotta text-white font-bold'
                : 'bg-craft-stone text-craft-charcoal'
            }`}
          >
            1. Photo
          </span>
          <span className="text-craft-sand">•</span>
          <span
            className={`px-3 py-1 rounded-full ${
              currentStep === 2
                ? 'bg-craft-terracotta text-white font-bold'
                : 'bg-craft-stone text-craft-charcoal'
            }`}
          >
            2. AI Studio
          </span>
          <span className="text-craft-sand">•</span>
          <span
            className={`px-3 py-1 rounded-full ${
              currentStep === 3
                ? 'bg-craft-terracotta text-white font-bold'
                : 'bg-craft-stone text-craft-charcoal'
            }`}
          >
            3. Catalog
          </span>
        </div>
      </div>

      {/* STEP 1: Upload or Capture Photo */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-craft-sand p-6 sm:p-8 shadow-craft-sm space-y-6">
            <h2 className="text-lg font-serif font-bold text-craft-charcoal">
              {t('add_product.step1_title', 'Step 1: Product Photography')}
            </h2>

            {/* Camera View Area */}
            {cameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-black max-w-lg mx-auto">
                <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover" />
                <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4">
                  <button
                    type="button"
                    onClick={handleCaptureSnapshot}
                    className="w-14 h-14 rounded-full bg-white border-4 border-craft-terracotta flex items-center justify-center shadow-lg"
                    aria-label="Capture Photo"
                  >
                    <div className="w-8 h-8 rounded-full bg-craft-terracotta"></div>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="p-3 rounded-full bg-black/60 text-white"
                    aria-label="Cancel Camera"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Box */}
                <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-craft-sand hover:border-craft-terracotta bg-craft-stone/30 hover:bg-craft-stone/60 cursor-pointer transition-all text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-craft-terracotta/10 text-craft-terracotta flex items-center justify-center shadow-craft-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-craft-charcoal block">
                      {t('btn.upload_photo', 'Upload Photo from Device')}
                    </span>
                    <span className="text-xs text-craft-muted">PNG, JPG, WEBP up to 20MB</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Live Camera Button */}
                <div
                  onClick={handleStartCamera}
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-craft-sand hover:border-craft-terracotta bg-craft-stone/30 hover:bg-craft-stone/60 cursor-pointer transition-all text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-craft-brass/10 text-craft-brass flex items-center justify-center shadow-craft-sm">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-craft-charcoal block">
                      {t('btn.use_camera', 'Use Camera (Phone or Webcam)')}
                    </span>
                    <span className="text-xs text-craft-muted">Take a live photo in your workshop</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Demo Craft Photos */}
            <div className="pt-4 border-t border-craft-sand/80 space-y-3">
              <div className="text-xs font-semibold text-craft-muted uppercase tracking-wider">
                Or select a sample artisan craft photo:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_RAW_PHOTOS.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedImageUrl(sample.url);
                      setCategory(sample.category);
                      setMaterial(sample.material);
                    }}
                    className={`rounded-xl border overflow-hidden cursor-pointer transition-all ${
                      selectedImageUrl === sample.url
                        ? 'border-craft-terracotta ring-2 ring-craft-terracotta'
                        : 'border-craft-sand hover:border-craft-terracotta/60'
                    }`}
                  >
                    <SafeImage src={sample.url} alt={sample.name} className="w-full h-24 object-cover" />
                    <div className="p-2 text-[11px] font-medium text-craft-charcoal truncate bg-white">
                      {sample.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Image Preview & Next Step CTA */}
            {selectedImageUrl && (
              <div className="pt-4 border-t border-craft-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={selectedImageUrl}
                    alt="Selected craft"
                    className="w-16 h-16 rounded-xl object-cover border border-craft-sand"
                  />
                  <div>
                    <span className="text-xs font-bold text-craft-charcoal block">
                      Photo Ready for AI Processing
                    </span>
                    <span className="text-xs text-craft-muted">
                      Proceed to real background removal and preservation
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-craft-terracotta hover:bg-craft-terracotta-dark text-white rounded-xl text-xs font-semibold shadow-craft-md flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Launch AI Product Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: AI Product Studio */}
      {currentStep === 2 && selectedImageUrl && (
        <div className="space-y-6">
          <AIProductStudio
            originalImageUrl={selectedImageUrl}
            category={category}
            onStudioComplete={(res) => {
              setStudioResult(res);
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
          />
        </div>
      )}

      {/* STEP 3: Catalog Generation & Review */}
      {currentStep === 3 && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-craft-sand p-6 sm:p-8 shadow-craft-sm space-y-8">
            <div className="flex items-center justify-between border-b border-craft-sand pb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-craft-charcoal">
                  {t('add_product.step3_title', 'Step 3: Review & Publish')}
                </h2>
                <p className="text-xs text-craft-muted">
                  Review AI suggestions, edit freely, and publish your handcrafted item.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs text-craft-terracotta font-semibold hover:underline"
              >
                ← Back to AI Studio
              </button>
            </div>

            {/* Telugu Voice Description Assistant */}
            <TeluguVoiceInput onDescriptionGenerated={handleVoiceData} />

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Product Title */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-craft-charcoal">
                    {t('catalog.title_label', 'Product Title')} *
                  </label>
                  {isVoiceExtracted && title && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-populated from voice
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Handcrafted Bamboo Basket"
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-craft-charcoal">
                    {t('catalog.category_label', 'Craft Category')}
                  </label>
                  {isVoiceExtracted && category && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-populated
                    </span>
                  )}
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta bg-white"
                >
                  <option value="Bamboo & Cane">Bamboo & Cane (Bamboo Craft)</option>
                  <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                  <option value="Handloom & Textiles">Handloom & Textiles</option>
                  <option value="Wood Carving">Wood Carving</option>
                  <option value="Metal & Brass Craft">Metal & Brass Craft</option>
                  <option value="Artisanal Jewelry">Artisanal Jewelry</option>
                  <option value="Home Decor">Home Decor</option>
                </select>
              </div>

              {/* Material */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-craft-charcoal">
                    {t('catalog.material_label', 'Primary Material')}
                  </label>
                  {isVoiceExtracted && material && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-populated
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Natural Bamboo, pure silk"
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta"
                />
              </div>

              {/* Craft Type / Technique */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-craft-charcoal flex items-center gap-1">
                    <Hammer className="w-3.5 h-3.5 text-craft-terracotta" />
                    <span>Craft Type / Technique</span>
                  </label>
                  {isVoiceExtracted && craftType && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-populated
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                  placeholder="e.g. Handmade / Handwoven"
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta"
                />
              </div>

              {/* Making Time */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-craft-charcoal flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-craft-terracotta" />
                    <span>Making Time / Effort</span>
                  </label>
                  {isVoiceExtracted && makingTime && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-populated
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={makingTime}
                  onChange={(e) => setMakingTime(e.target.value)}
                  placeholder="e.g. 3 days"
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="text-xs font-semibold text-craft-charcoal block mb-1">
                  {t('catalog.size_label', 'Dimensions / Size')}
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g., 10 inch height × 5 inch diameter"
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="text-xs font-semibold text-craft-charcoal block mb-1">
                  {t('catalog.stock_label', 'Available Stock Quantity')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-craft-charcoal">
                    {t('catalog.description_label', 'Product Story & Description')}
                  </label>
                  {isVoiceExtracted && description && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Story Generated
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an authentic description of your craft..."
                  className="w-full px-4 py-2.5 rounded-xl border border-craft-sand text-sm focus:outline-none focus:border-craft-terracotta"
                />
              </div>

              {/* SECTION 12: COMPLETE AI PRICING & COST BREAKDOWN SECTION */}
              <div className="md:col-span-2 p-6 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-6">
                {/* Title & Tagline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-craft-charcoal flex items-center gap-2">
                      <Coins className="w-5 h-5 text-craft-terracotta" />
                      <span>💰 Your Product Price & Cost Breakdown</span>
                    </h3>
                    <p className="text-xs text-craft-muted mt-1">
                      AI pricing based on production costs, craft effort, and fair artisan returns.
                    </p>
                  </div>
                  {isCostVoiceExtracted && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Costs Analyzed
                    </span>
                  )}
                </div>

                {/* Voice 2 Input Component */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={costVoiceRecording ? handleStopCostListening : handleStartCostListening}
                        className={`px-5 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                          costVoiceRecording
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                            : 'bg-craft-terracotta hover:bg-craft-terracotta-dark text-white'
                        }`}
                      >
                        {costVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span>{costVoiceRecording ? 'Listening to Cost Details...' : '🎤 Speak Cost & Effort Details'}</span>
                      </button>

                      {costVoiceTranscript && (
                        <button
                          type="button"
                          onClick={handleStartCostListening}
                          className="px-3.5 py-3 rounded-xl bg-white hover:bg-craft-stone border border-amber-300 text-craft-charcoal font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                          title="Record Again"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-craft-terracotta" />
                          <span>Record Again</span>
                        </button>
                      )}
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center gap-1 text-xs bg-white border border-amber-200 rounded-xl p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setCostVoiceLanguage('en-IN')}
                        className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                          costVoiceLanguage === 'en-IN'
                            ? 'bg-craft-terracotta text-white'
                            : 'text-craft-muted hover:text-craft-charcoal'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setCostVoiceLanguage('te-IN')}
                        className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                          costVoiceLanguage === 'te-IN'
                            ? 'bg-craft-terracotta text-white'
                            : 'text-craft-muted hover:text-craft-charcoal'
                        }`}
                      >
                        తెలుగు (Telugu)
                      </button>
                    </div>
                  </div>

                  {/* Voice Transcript Display Card with Edit Mode */}
                  {costVoiceTranscript && (
                    <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-craft-charcoal uppercase tracking-wider flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-craft-terracotta" />
                          <span>Voice Input Transcript</span>
                        </span>
                        {!isEditingCostTranscript ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEditedCostTranscript(costVoiceTranscript);
                              setIsEditingCostTranscript(true);
                            }}
                            className="text-xs text-craft-terracotta font-semibold hover:underline flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Transcript</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingCostTranscript(false)}
                            className="text-xs text-craft-muted font-semibold hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {isEditingCostTranscript ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={editedCostTranscript}
                            onChange={(e) => setEditedCostTranscript(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg border border-amber-300 focus:outline-none focus:border-craft-terracotta text-craft-charcoal"
                            placeholder="Edit voice transcript..."
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingCostTranscript(false)}
                              className="px-3 py-1.5 text-xs text-craft-muted hover:text-craft-charcoal font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => processCostSpeech(editedCostTranscript)}
                              className="px-4 py-1.5 bg-craft-terracotta hover:bg-craft-terracotta-dark text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Update & Re-Extract</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {lastExtractedCost?.teluguOriginal ? (
                            <>
                              <div className="text-xs text-craft-charcoal bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                                <span className="text-[10px] font-bold text-craft-terracotta block uppercase">Telugu Original:</span>
                                <span>"{lastExtractedCost.teluguOriginal}"</span>
                              </div>
                              {lastExtractedCost?.englishTranslation && (
                                <div className="text-xs text-craft-charcoal bg-white p-2.5 rounded-lg border border-craft-sand">
                                  <span className="text-[10px] font-bold text-craft-muted block uppercase">English Translation:</span>
                                  <span className="italic">"{lastExtractedCost.englishTranslation}"</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs text-craft-charcoal bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 italic">
                              "{costVoiceTranscript}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI DETECTED DETAILS Preview Card */}
                  {lastExtractedCost && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-xl border border-amber-300 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-craft-terracotta" />
                          <h4 className="text-xs font-bold text-craft-charcoal uppercase tracking-wider">
                            ✨ AI Detected Details
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyExtractedCostDetails(lastExtractedCost)}
                          className="px-3 py-1 rounded-lg bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply to Form</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                          <span className="text-[11px] text-craft-muted block">Material Cost</span>
                          <span className="font-bold text-craft-charcoal text-sm">
                            {lastExtractedCost.materialCost !== undefined ? `₹${lastExtractedCost.materialCost.toLocaleString('en-IN')}` : <span className="text-craft-muted text-xs font-normal">Not mentioned</span>}
                          </span>
                        </div>

                        <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                          <span className="text-[11px] text-craft-muted block">Labor Cost / Effort</span>
                          <span className="font-bold text-craft-charcoal text-sm">
                            {lastExtractedCost.laborCost !== undefined
                              ? `₹${lastExtractedCost.laborCost.toLocaleString('en-IN')}`
                              : lastExtractedCost.laborHours !== undefined
                              ? `${lastExtractedCost.laborHours} hrs`
                              : <span className="text-craft-muted text-xs font-normal">Not mentioned</span>}
                          </span>
                        </div>

                        <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                          <span className="text-[11px] text-craft-muted block">Making Time</span>
                          <span className="font-bold text-craft-charcoal text-sm">
                            {lastExtractedCost.makingTime || <span className="text-craft-muted text-xs font-normal">Not mentioned</span>}
                          </span>
                        </div>

                        <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                          <span className="text-[11px] text-craft-muted block">Packaging Cost</span>
                          <span className="font-bold text-craft-charcoal text-sm">
                            {lastExtractedCost.packagingCost !== undefined ? `₹${lastExtractedCost.packagingCost.toLocaleString('en-IN')}` : <span className="text-craft-muted text-xs font-normal">Not mentioned</span>}
                          </span>
                        </div>

                        <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                          <span className="text-[11px] text-craft-muted block">Other Costs</span>
                          <span className="font-bold text-craft-charcoal text-sm">
                            {lastExtractedCost.otherCosts !== undefined ? `₹${lastExtractedCost.otherCosts.toLocaleString('en-IN')}` : <span className="text-craft-muted text-xs font-normal">Not mentioned</span>}
                          </span>
                        </div>

                        <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                          <span className="text-[11px] text-craft-muted block">Artisan's Current Price</span>
                          <span className="font-bold text-craft-charcoal text-sm">
                            {lastExtractedCost.existingPrice !== undefined ? `₹${lastExtractedCost.existingPrice.toLocaleString('en-IN')}` : <span className="text-craft-muted text-xs font-normal">Not mentioned (Optional)</span>}
                          </span>
                        </div>
                      </div>

                      {costVoiceMessage && (
                        <div className="text-xs text-amber-900 bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium">{costVoiceMessage}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sample Voice Inputs Helper */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-craft-charcoal flex items-center gap-1">
                      <span>Sample voice inputs helper (Click to test):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => processCostSpeech('Material cost is 800, labor is 600, packaging is 100, other costs are 50, current price is 2200, and it takes 4 days.')}
                        className="text-left px-3 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-xs text-craft-charcoal transition-colors group shadow-sm"
                      >
                        <span className="font-semibold text-craft-terracotta block text-[11px]">Example 1 (User Prompt Example - All 6 Fields):</span>
                        <span className="text-craft-muted group-hover:text-craft-charcoal text-[11px]">"Material cost is 800, labor is 600, packaging is 100, other costs are 50, current price is 2200, and it takes 4 days."</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => processCostSpeech('మెటీరియల్ ఖర్చు 800 రూపాయలు, లేబర్ ఖర్చు 600 రూపాయలు, ప్యాకేజింగ్ 100 రూపాయలు, ఇతర ఖర్చులు 50 రూపాయలు, ప్రస్తుత ధర 2200 రూపాయలు, తయారీ సమయం 4 రోజులు')}
                        className="text-left px-3 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-xs text-craft-charcoal transition-colors group shadow-sm"
                      >
                        <span className="font-semibold text-craft-terracotta block text-[11px]">Example 2 (Telugu Voice - Full Breakdown):</span>
                        <span className="text-craft-muted group-hover:text-craft-charcoal text-[11px]">"మెటీరియల్ ఖర్చు 800 రూపాయలు, లేబర్ ఖర్చు 600 రూపాయలు, ప్యాకేజింగ్ 100 రూపాయలు, ఇతర ఖర్చులు 50 రూపాయలు, ప్రస్తుత ధర 2200 రూపాయలు, తయారీ సమయం 4 రోజులు"</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => processCostSpeech('Material cost is 500 and it takes 2 days.')}
                        className="text-left px-3 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-xs text-craft-charcoal transition-colors group shadow-sm"
                      >
                        <span className="font-semibold text-craft-terracotta block text-[11px]">Example 3 (Partial Input - Non-destructive):</span>
                        <span className="text-craft-muted group-hover:text-craft-charcoal text-[11px]">"Material cost is 500 and it takes 2 days."</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => processCostSpeech('I spend 750 rupees on raw materials, around 450 rupees for artisan work, 80 rupees for packing box, 40 rupees extra, and I currently sell it for 1800 rupees. It took 3 days.')}
                        className="text-left px-3 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-xs text-craft-charcoal transition-colors group shadow-sm"
                      >
                        <span className="font-semibold text-craft-terracotta block text-[11px]">Example 4 (Natural Speech Variation):</span>
                        <span className="text-craft-muted group-hover:text-craft-charcoal text-[11px]">"I spend 750 rupees on raw materials, around 450 rupees for artisan work, 80 rupees for packing box, 40 rupees extra, and I currently sell it for 1800 rupees. It took 3 days."</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cost & Effort Details (Auto-filled / Editable) */}
                <div className="bg-white p-5 rounded-xl border border-amber-200/90 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-craft-charcoal uppercase tracking-wider">
                      Cost & Effort Details (Auto-filled / Editable)
                    </h4>
                    <button
                      type="button"
                      onClick={handleRecalculatePrice}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                      <span>🔄 Recalculate Price</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Material Cost */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-craft-charcoal">
                          Material Cost (₹)
                        </label>
                        {lastExtractedCost?.materialCost !== undefined && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> From voice
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-craft-muted font-bold">₹</span>
                        <input
                          type="number"
                          value={materialCost !== undefined ? materialCost : ''}
                          onChange={(e) => {
                            const val = e.target.value !== '' ? parseInt(e.target.value, 10) : undefined;
                            setMaterialCost(val);
                          }}
                          placeholder="e.g. 800"
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-craft-sand text-sm font-semibold text-craft-charcoal focus:outline-none focus:border-craft-terracotta"
                        />
                      </div>
                    </div>

                    {/* Labor Cost */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-craft-charcoal">
                          Labor Cost / Effort (₹)
                        </label>
                        {(lastExtractedCost?.laborCost !== undefined || lastExtractedCost?.laborHours !== undefined) && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> From voice
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-craft-muted font-bold">₹</span>
                        <input
                          type="number"
                          value={laborCost !== undefined ? laborCost : ''}
                          onChange={(e) => {
                            const val = e.target.value !== '' ? parseInt(e.target.value, 10) : undefined;
                            setLaborCost(val);
                          }}
                          placeholder={laborHours ? `₹${laborHours * 120} (${laborHours} hrs)` : 'e.g. 600'}
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-craft-sand text-sm font-semibold text-craft-charcoal focus:outline-none focus:border-craft-terracotta"
                        />
                      </div>
                    </div>

                    {/* Making Time */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-craft-charcoal">
                          Making Time
                        </label>
                        {lastExtractedCost?.makingTime !== undefined && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> From voice
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={makingTime}
                        onChange={(e) => setMakingTime(e.target.value)}
                        placeholder="e.g. 4 days"
                        className="w-full px-3 py-2 rounded-xl border border-craft-sand text-sm font-semibold text-craft-charcoal focus:outline-none focus:border-craft-terracotta"
                      />
                    </div>

                    {/* Packaging Cost */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-craft-charcoal">
                          Packaging Cost (₹)
                        </label>
                        {lastExtractedCost?.packagingCost !== undefined && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> From voice
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-craft-muted font-bold">₹</span>
                        <input
                          type="number"
                          value={packagingCost !== undefined ? packagingCost : ''}
                          onChange={(e) => {
                            const val = e.target.value !== '' ? parseInt(e.target.value, 10) : undefined;
                            setPackagingCost(val);
                          }}
                          placeholder="e.g. 100 (optional)"
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-craft-sand text-sm font-semibold text-craft-charcoal focus:outline-none focus:border-craft-terracotta"
                        />
                      </div>
                    </div>

                    {/* Other Costs */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-craft-charcoal">
                          Other Costs (₹)
                        </label>
                        {lastExtractedCost?.otherCosts !== undefined && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> From voice
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-craft-muted font-bold">₹</span>
                        <input
                          type="number"
                          value={otherCosts !== undefined ? otherCosts : ''}
                          onChange={(e) => {
                            const val = e.target.value !== '' ? parseInt(e.target.value, 10) : undefined;
                            setOtherCosts(val);
                          }}
                          placeholder="e.g. 50 (optional)"
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-craft-sand text-sm font-semibold text-craft-charcoal focus:outline-none focus:border-craft-terracotta"
                        />
                      </div>
                    </div>

                    {/* Artisan's Current Price */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-craft-charcoal">
                          Artisan's Current Price (₹) <span className="text-[10px] text-craft-muted font-normal">(Optional)</span>
                        </label>
                        {lastExtractedCost?.existingPrice !== undefined && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> From voice
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-craft-muted font-bold">₹</span>
                        <input
                          type="number"
                          value={artisanCurrentPrice !== undefined ? artisanCurrentPrice : ''}
                          onChange={(e) => {
                            const val = e.target.value !== '' ? parseInt(e.target.value, 10) : undefined;
                            setArtisanCurrentPrice(val);
                          }}
                          placeholder="e.g. 2200 (if selling already)"
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-craft-sand text-sm font-semibold text-craft-charcoal focus:outline-none focus:border-craft-terracotta"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Missing information prompt if insufficient data */}
                {!priceRange.hasEnoughInfo && priceRange.missingInformationMessage && (
                  <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">More information needed</span>
                      <span className="text-amber-800">{priceRange.missingInformationMessage}</span>
                    </div>
                  </div>
                )}

                {/* Production Cost Breakdown Card */}
                <div className="bg-white p-5 rounded-xl border border-amber-200/90 space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-craft-charcoal uppercase tracking-wider flex items-center justify-between">
                    <span>Production Cost Breakdown</span>
                    <span className="text-[11px] font-normal text-craft-muted lowercase">based on input</span>
                  </h4>
                  <div className="divide-y divide-craft-sand/50 text-xs">
                    <div className="py-2 flex justify-between">
                      <span className="text-craft-muted">Material Cost:</span>
                      <span className="font-semibold text-craft-charcoal">
                        {priceRange.productionCost?.materialCost != null && priceRange.productionCost.materialCost > 0
                          ? `₹${priceRange.productionCost.materialCost.toLocaleString('en-IN')}`
                          : 'Not provided'}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-craft-muted">Labor Cost ({makingTime || 'Artisan Effort'}):</span>
                      <span className="font-semibold text-craft-charcoal">
                        {priceRange.productionCost?.laborCost != null && priceRange.productionCost.laborCost > 0
                          ? `₹${priceRange.productionCost.laborCost.toLocaleString('en-IN')}`
                          : 'Not provided'}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-craft-muted">Packaging Cost:</span>
                      <span className="font-semibold text-craft-charcoal">
                        {priceRange.productionCost?.packagingCost != null && priceRange.productionCost.packagingCost > 0
                          ? `₹${priceRange.productionCost.packagingCost.toLocaleString('en-IN')}`
                          : '₹0 (Not provided)'}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-craft-muted">Other Costs:</span>
                      <span className="font-semibold text-craft-charcoal">
                        {priceRange.productionCost?.otherCosts != null && priceRange.productionCost.otherCosts > 0
                          ? `₹${priceRange.productionCost.otherCosts.toLocaleString('en-IN')}`
                          : '₹0 (Not provided)'}
                      </span>
                    </div>
                    <div className="pt-2.5 flex justify-between text-sm font-bold text-craft-charcoal">
                      <span>Total Production Cost:</span>
                      <span className="text-craft-terracotta">
                        ₹{priceRange.productionCost?.totalProductionCost != null
                          ? priceRange.productionCost.totalProductionCost.toLocaleString('en-IN')
                          : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Pricing Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Estimated Price Range */}
                  <div className="p-4 rounded-xl bg-white border border-amber-200 flex flex-col justify-between space-y-2 shadow-sm">
                    <div>
                      <div className="text-xs font-semibold text-craft-muted flex items-center gap-1.5 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-craft-terracotta" />
                        <span>AI Estimated Price Range</span>
                      </div>
                      <div className="text-xl font-serif font-bold text-craft-charcoal">
                        ₹{priceRange.min.toLocaleString('en-IN')} – ₹{priceRange.max.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <p className="text-[11px] text-craft-muted">
                      Estimated corridor based on your production costs and {category}.
                    </p>
                  </div>

                  {/* Recommended Selling Price */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-craft-terracotta/10 to-amber-100/60 border border-craft-terracotta/30 flex flex-col justify-between space-y-2 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-craft-terracotta flex items-center gap-1 mb-1">
                          <span>⭐ Recommended Selling Price</span>
                        </div>
                        <div className="text-2xl font-serif font-bold text-craft-charcoal">
                          ₹{(priceRange.recommendedPrice || priceRange.min).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrice(priceRange.recommendedPrice || priceRange.min)}
                        className="px-3 py-1.5 rounded-lg bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
                      >
                        Use Recommended Price
                      </button>
                    </div>
                    <p className="text-[11px] text-craft-charcoal/80 font-medium">
                      Calculated for fair artisan wages, cost coverage, and sustainable market appeal.
                    </p>
                  </div>
                </div>

                {/* Comparison with Artisan's Current Price (Only if provided) */}
                {priceRange.artisanCurrentPrice != null && priceRange.artisanCurrentPrice > 0 && (
                  <div className="p-4 rounded-xl bg-craft-stone/80 border border-craft-sand space-y-2 text-xs">
                    <div className="font-bold text-craft-charcoal flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-craft-terracotta" />
                      <span>Price Comparison</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="text-craft-muted">Your Current Price: </span>
                        <span className="font-semibold text-craft-charcoal">₹{priceRange.artisanCurrentPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-craft-muted">AI Recommendation: </span>
                        <span className="font-semibold text-craft-terracotta">₹{(priceRange.recommendedPrice || priceRange.min).toLocaleString('en-IN')}</span>
                      </div>
                      {(priceRange.recommendedPrice || priceRange.min) > priceRange.artisanCurrentPrice && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          +₹{((priceRange.recommendedPrice || priceRange.min) - priceRange.artisanCurrentPrice).toLocaleString('en-IN')} higher return for your craft
                        </span>
                      )}
                      {(priceRange.recommendedPrice || priceRange.min) < priceRange.artisanCurrentPrice && (
                        <span className="text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Your current price is higher than standard range, which works well for premium editions.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Final Selling Price Field (Artisan Agency) */}
                <div className="p-4 rounded-xl bg-white border-2 border-craft-terracotta/40 space-y-2 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="w-full sm:w-64">
                      <label className="text-xs font-bold text-craft-charcoal block mb-1">
                        Final Selling Price (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-sm font-bold text-craft-muted">₹</span>
                        <input
                          type="number"
                          value={price || ''}
                          onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-craft-sand text-lg font-bold text-craft-charcoal focus:outline-none focus:border-craft-terracotta bg-craft-warm/20"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-craft-muted sm:text-right max-w-sm">
                      <p className="font-medium text-craft-charcoal">✨ You have 100% control</p>
                      <p className="text-[11px] mt-0.5">
                        Set whatever price you feel is right. The AI recommendation is an estimate and recommendation, not a fixed rule.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why this price? Human Explanation */}
                <div className="p-4 rounded-xl bg-white/90 border border-amber-200/80 space-y-1.5 text-xs shadow-sm">
                  <div className="font-bold text-craft-charcoal flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-craft-terracotta" />
                    <span>Why this price?</span>
                  </div>
                  <p className="text-craft-charcoal leading-relaxed font-sans">
                    {priceRange.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Final Listing Preview & Submit */}
            <div className="pt-6 border-t border-craft-sand flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SafeImage
                  src={studioResult?.enhancedImageUrl || selectedImageUrl}
                  alt={title || 'Preview'}
                  className="w-14 h-14 rounded-xl object-cover border border-craft-sand"
                />
                <div>
                  <div className="text-xs font-bold text-craft-charcoal line-clamp-1">
                    {title || 'Untitled Craft'}
                  </div>
                  <div className="text-xs text-craft-terracotta font-semibold">
                    ₹{price.toLocaleString('en-IN')} • {category}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-xl border border-craft-sand text-craft-charcoal hover:bg-craft-stone text-xs font-medium"
                >
                  Edit Studio Image
                </button>

                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handlePublish}
                  className="w-1/2 sm:w-auto px-8 py-3 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-semibold shadow-craft-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing...' : t('btn.publish_product', 'Publish Product')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
