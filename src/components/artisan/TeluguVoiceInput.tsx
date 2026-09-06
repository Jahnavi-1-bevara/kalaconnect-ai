import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  TeluguVoiceService,
  isVoiceRecognitionSupported,
  extractProductDetailsFromVoice,
  ExtractedProductDetails,
} from '../../services/voiceRecognition';
import {
  Mic,
  MicOff,
  Sparkles,
  Check,
  AlertCircle,
  Volume2,
  Tag,
  Layers,
  Clock,
  Hammer,
  Leaf,
  CheckCircle2,
} from 'lucide-react';

interface VoiceInputProps {
  onDescriptionGenerated: (data: {
    title: string;
    description: string;
    category: string;
    material: string;
    craftType: string;
    makingTime: string;
    teluguOriginal?: string;
  }) => void;
}

export const TeluguVoiceInput: React.FC<VoiceInputProps> = ({ onDescriptionGenerated }) => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<'te-IN' | 'en-IN'>('en-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [extractedDetails, setExtractedDetails] = useState<ExtractedProductDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const voiceServiceRef = useRef<TeluguVoiceService | null>(null);

  useEffect(() => {
    setIsSupported(isVoiceRecognitionSupported());
    voiceServiceRef.current = new TeluguVoiceService(selectedLang);

    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
      }
    };
  }, []);

  const handleLanguageChange = (lang: 'te-IN' | 'en-IN') => {
    setSelectedLang(lang);
    if (voiceServiceRef.current) {
      voiceServiceRef.current.setLanguage(lang);
    }
  };

  const processSpokenText = (text: string) => {
    setTranscript(text);
    const extracted = extractProductDetailsFromVoice(text);
    setExtractedDetails(extracted);
    onDescriptionGenerated({
      title: extracted.productName,
      description: extracted.description,
      category: extracted.category,
      material: extracted.material,
      craftType: extracted.craftType,
      makingTime: extracted.makingTime,
      teluguOriginal: extracted.teluguOriginal || (extracted.detectedLanguage === 'telugu' ? text : undefined),
    });
  };

  const handleStartListening = () => {
    setErrorMessage('');
    if (!voiceServiceRef.current) {
      voiceServiceRef.current = new TeluguVoiceService(selectedLang);
    }

    setIsRecording(true);
    const success = voiceServiceRef.current.startListening(
      (text) => {
        processSpokenText(text);
      },
      (err) => {
        setIsRecording(false);
        setErrorMessage(t('voice.fallback_msg', 'Voice input is unavailable. You can click any sample craft voice phrase or type details.'));
      },
      () => {
        setIsRecording(false);
      },
      selectedLang
    );

    if (!success) {
      setIsRecording(false);
      setErrorMessage(t('voice.fallback_msg', 'Voice input is unavailable. You can click any sample craft voice phrase or type details.'));
    }
  };

  const handleStopListening = () => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stopListening();
    }
    setIsRecording(false);
  };

  // Sample phrases designed to test both English and Telugu NLP extraction
  const sampleVoicePhrases = [
    {
      lang: 'en',
      tag: 'Exact User Test Case',
      label: 'Handmade Bamboo Basket',
      phrase: 'This is a handmade bamboo basket made from natural bamboo and it takes three days to make.',
    },
    {
      lang: 'en',
      tag: 'Handloom Silk',
      label: 'Pure Silk Saree',
      phrase: 'This is a handwoven silk saree made from pure mulberry silk and it takes seven days to make.',
    },
    {
      lang: 'en',
      tag: 'Terracotta Pottery',
      label: 'Clay Water Pitcher',
      phrase: 'Handcrafted terracotta water pot made from natural clay that keeps water cool, takes 2 days to make.',
    },
    {
      lang: 'en',
      tag: 'Wood Carving',
      label: 'Handcarved Wooden Toy',
      phrase: 'Handcarved wooden elephant toy made of seasoned teak wood, took 4 days.',
    },
    {
      lang: 'te',
      tag: 'తెలుగు నమూనా 1',
      label: 'వెదురు బుట్ట (Bamboo Basket)',
      phrase: 'ఇది సహజమైన వెదురుతో చేసిన వెదురు బుట్ట, చేతితో అల్లినది, తయారు చేయడానికి మూడు రోజులు పడుతుంది',
    },
    {
      lang: 'te',
      tag: 'తెలుగు నమూనా 2',
      label: 'మట్టి కుండ (Terracotta Pot)',
      phrase: 'ఇది చేతితో చేసిన మట్టి కుండ, సహజంగా నీళ్లు చల్లగా ఉంచడానికి ఉపయోగపడుతుంది, తయారు చేయడానికి రెండు రోజులు పడుతుంది',
    },
    {
      lang: 'te',
      tag: 'తెలుగు నమూనా 3',
      label: 'చేనేత చీర (Handloom Saree)',
      phrase: 'ఇది పట్టు చేనేత చీర, సంప్రదాయ కలంకారి పూల డిజైన్ తో నేసినది, వారం రోజులు పట్టింది',
    },
    {
      lang: 'te',
      tag: 'తెలుగు నమూనా 4',
      label: 'ఇత్తడి ప్రతిమ (Dokra Brass)',
      phrase: 'ఇది డోక్రా పద్ధతిలో చేసిన ఇత్తడి ఏనుగు బొమ్మ, సాంప్రదాయ పోతపోత పని, 5 రోజులు పట్టింది',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-craft-sand p-6 shadow-craft-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-craft-sand/70 pb-4">
        <div>
          <h3 className="text-base font-serif font-bold text-craft-charcoal flex items-center gap-2">
            <Mic className="w-5 h-5 text-craft-terracotta" />
            <span>AI Voice Craft Description & NLP Extraction</span>
          </h3>
          <p className="text-xs text-craft-muted mt-0.5">
            Speak naturally in English or Telugu. KalaConnect AI extracts Product Name, Category, Material, Craft Type & Making Time automatically.
          </p>
        </div>

        {/* Language Selector Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-craft-stone/60 border border-craft-sand shrink-0">
          <button
            type="button"
            onClick={() => handleLanguageChange('en-IN')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedLang === 'en-IN'
                ? 'bg-craft-terracotta text-white shadow-sm'
                : 'text-craft-charcoal hover:text-craft-terracotta'
            }`}
          >
            English (India)
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('te-IN')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedLang === 'te-IN'
                ? 'bg-craft-terracotta text-white shadow-sm'
                : 'text-craft-charcoal hover:text-craft-terracotta'
            }`}
          >
            తెలుగు (te-IN)
          </button>
        </div>
      </div>

      {/* Error Fallback Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Microphone Control Area */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-craft-stone/40 border border-craft-sand/60 text-center space-y-4">
        <div className="relative">
          {isRecording && (
            <div className="absolute -inset-3 rounded-full bg-craft-terracotta/20 animate-ping"></div>
          )}
          <button
            type="button"
            onClick={isRecording ? handleStopListening : handleStartListening}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-craft-md transition-all ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white scale-105'
                : 'bg-craft-terracotta hover:bg-craft-terracotta-dark text-white'
            }`}
            aria-label={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          >
            {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-craft-charcoal">
            {isRecording
              ? `Listening in ${selectedLang === 'te-IN' ? 'Telugu' : 'English'}... speak naturally...`
              : `Click microphone to speak in ${selectedLang === 'te-IN' ? 'Telugu' : 'English'}`}
          </p>
          <p className="text-xs text-craft-muted">
            Voice → Speech-to-Text → AI/NLP Understanding → Structured Information Extraction
          </p>
        </div>

        {/* Live Audio Waves Simulation */}
        {isRecording && (
          <div className="flex items-center gap-1 h-6">
            <span className="w-1 h-3 bg-craft-terracotta animate-pulse rounded-full"></span>
            <span className="w-1 h-6 bg-craft-terracotta animate-pulse delay-75 rounded-full"></span>
            <span className="w-1 h-4 bg-craft-terracotta animate-pulse delay-150 rounded-full"></span>
            <span className="w-1 h-5 bg-craft-terracotta animate-pulse delay-100 rounded-full"></span>
            <span className="w-1 h-2 bg-craft-terracotta animate-pulse delay-200 rounded-full"></span>
          </div>
        )}
      </div>

      {/* Quick Test Demo Phrases */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-craft-muted uppercase tracking-wider flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-craft-muted" />
          <span>Click to Test Natural Artisan Voice Phrases:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {sampleVoicePhrases.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => processSpokenText(item.phrase)}
              className="text-left p-3 rounded-xl border border-craft-sand bg-craft-stone/20 hover:bg-craft-stone/60 text-xs transition-colors hover:border-craft-terracotta/60 group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-craft-charcoal group-hover:text-craft-terracotta">
                  {item.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-craft-sand/60 text-craft-muted">
                  {item.tag}
                </span>
              </div>
              <div className="text-[11px] text-craft-muted font-sans leading-relaxed line-clamp-2">
                "{item.phrase}"
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Structured AI Extraction Output */}
      {extractedDetails && (
        <div className="space-y-4 pt-2 border-t border-craft-sand/80">
          {/* Transcript Display */}
          <div className="p-3.5 rounded-xl bg-craft-stone/30 border border-craft-sand/80 space-y-1">
            <div className="text-[11px] font-semibold text-craft-muted uppercase tracking-wider flex items-center justify-between">
              <span>Transcribed Artisan Voice Speech:</span>
              <span className="text-[10px] font-normal text-craft-forest flex items-center gap-1 bg-craft-forest/10 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> Transcribed
              </span>
            </div>
            <p className="text-sm font-medium text-craft-charcoal font-sans">
              "{transcript}"
            </p>
          </div>

          {/* Structured Attributes Grid */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>AI Structured Information Extraction:</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Form Fields Auto-Populated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {/* Product Name */}
              <div className="p-2.5 rounded-xl bg-white border border-amber-200/60 shadow-xs space-y-0.5">
                <div className="text-[10px] font-semibold text-craft-muted flex items-center gap-1 uppercase tracking-wider">
                  <Tag className="w-3 h-3 text-craft-terracotta" />
                  <span>Product Name</span>
                </div>
                <div className="text-xs font-bold text-craft-charcoal">
                  {extractedDetails.productName}
                </div>
              </div>

              {/* Category */}
              <div className="p-2.5 rounded-xl bg-white border border-amber-200/60 shadow-xs space-y-0.5">
                <div className="text-[10px] font-semibold text-craft-muted flex items-center gap-1 uppercase tracking-wider">
                  <Layers className="w-3 h-3 text-craft-terracotta" />
                  <span>Category</span>
                </div>
                <div className="text-xs font-bold text-craft-charcoal">
                  {extractedDetails.category}
                </div>
              </div>

              {/* Material */}
              <div className="p-2.5 rounded-xl bg-white border border-amber-200/60 shadow-xs space-y-0.5">
                <div className="text-[10px] font-semibold text-craft-muted flex items-center gap-1 uppercase tracking-wider">
                  <Leaf className="w-3 h-3 text-craft-forest" />
                  <span>Primary Material</span>
                </div>
                <div className="text-xs font-bold text-craft-charcoal">
                  {extractedDetails.material}
                </div>
              </div>

              {/* Craft Type */}
              <div className="p-2.5 rounded-xl bg-white border border-amber-200/60 shadow-xs space-y-0.5">
                <div className="text-[10px] font-semibold text-craft-muted flex items-center gap-1 uppercase tracking-wider">
                  <Hammer className="w-3 h-3 text-craft-terracotta" />
                  <span>Craft Type / Technique</span>
                </div>
                <div className="text-xs font-bold text-craft-charcoal">
                  {extractedDetails.craftType}
                </div>
              </div>

              {/* Making Time */}
              <div className="p-2.5 rounded-xl bg-white border border-amber-200/60 shadow-xs space-y-0.5 sm:col-span-2 md:col-span-2">
                <div className="text-[10px] font-semibold text-craft-muted flex items-center gap-1 uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-craft-terracotta" />
                  <span>Making Time / Effort</span>
                </div>
                <div className="text-xs font-bold text-craft-charcoal">
                  {extractedDetails.makingTime}
                </div>
              </div>
            </div>

            {/* Generated Catalog Story */}
            <div className="p-3 rounded-xl bg-white border border-amber-200/60 text-xs text-craft-charcoal space-y-1">
              <span className="text-[10px] font-semibold text-craft-muted uppercase tracking-wider block">
                Catalog Story & Description:
              </span>
              <p className="leading-relaxed text-craft-charcoal">
                {extractedDetails.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
