// Web Speech API interface definitions
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export const isVoiceRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export interface ExtractedProductDetails {
  productName: string;
  category: string;
  material: string;
  craftType: string;
  makingTime: string;
  size?: string;
  description: string;
  teluguOriginal?: string;
  detectedLanguage: 'telugu' | 'english';
  confidence: number;
}

export interface ExtractedCostAndEffort {
  materialCost?: number;
  laborCost?: number;
  laborHours?: number;
  makingTime?: string;
  packagingCost?: number;
  otherCosts?: number;
  existingPrice?: number;
  isIntricate?: boolean;
  rawText: string;
  teluguOriginal?: string;
  englishTranslation?: string;
  detectedLanguage?: 'telugu' | 'english';
  explanation: string;
}

export class TeluguVoiceService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;
  private currentLanguage: string = 'te-IN';

  constructor(lang: string = 'te-IN') {
    this.currentLanguage = lang;
    this.initRecognition();
  }

  public setLanguage(lang: string): void {
    this.currentLanguage = lang;
    if (this.recognition) {
      try {
        this.recognition.lang = lang;
      } catch {
        // Fallback re-init
        this.initRecognition();
      }
    }
  }

  private initRecognition(): void {
    if (typeof window !== 'undefined') {
      const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechClass) {
        try {
          this.recognition = new SpeechClass();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = this.currentLanguage;
        } catch {
          this.recognition = null;
        }
      }
    }
  }

  public startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onEnd: () => void,
    lang?: string
  ): boolean {
    if (lang && lang !== this.currentLanguage) {
      this.setLanguage(lang);
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      onError('Voice input is unavailable in this browser. You can type details instead or use sample craft phrases.');
      return false;
    }

    try {
      this.isListening = true;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        if (event && event.results && event.results[0] && event.results[0][0]) {
          transcript = event.results[0][0].transcript || '';
        }
        onResult(transcript, true);
      };

      this.recognition.onerror = (e) => {
        this.isListening = false;
        console.warn('Speech recognition notice:', e.error);
        onError('Voice input interrupted or unavailable. You can click sample voice phrases below or type.');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch {
      this.isListening = false;
      onError('Voice input could not start. Please check microphone permissions or use sample voice phrases.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore error on stop
      }
    }
    this.isListening = false;
  }
}

// Number word to digit mapping
const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  twenty: 20,
  'a couple of': 2,
  'a few': 3,
};

const TELUGU_NUMBERS: Record<string, number> = {
  ఒక: 1,
  రెండు: 2,
  మూడు: 3,
  నాలుగు: 4,
  ఐదు: 5,
  ఆరు: 6,
  ఏడు: 7,
  ఎనిమిది: 8,
  తొమ్మిది: 9,
  పది: 10,
  పదహారు: 16,
};

/**
 * Capitalizes every word in a title
 */
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Extracts structured product details from artisan speech (in English or Telugu).
 * Extracts:
 * - Product Name (e.g. "Bamboo Basket")
 * - Category (e.g. "Bamboo & Cane")
 * - Material (e.g. "Natural Bamboo")
 * - Craft Type (e.g. "Handmade / Handwoven")
 * - Making Time (e.g. "3 days")
 */
export const extractProductDetailsFromVoice = (speechText: string): ExtractedProductDetails => {
  const raw = (speechText || '').trim();
  const lower = raw.toLowerCase();

  const isTelugu = /[\u0C00-\u0C7F]/.test(raw);

  let productName = 'Handcrafted Artisan Creation';
  let category = 'Indian Handicrafts';
  let material = 'Artisanal Natural Material';
  let craftType = 'Handmade / Handcrafted';
  let makingTime = '2-3 days';
  const size = '';

  if (isTelugu) {
    // ================= TELUGU NLP PARSING =================
    // 1. Category & Material
    if (lower.includes('వెదురు') || lower.includes('బుట్ట')) {
      category = 'Bamboo & Cane';
      material = lower.includes('సహజ') ? 'Natural Bamboo' : 'Sustainably Harvested Bamboo';
      productName = 'Bamboo Basket (వెదురు బుట్ట)';
      craftType = 'Handmade / Handwoven';
    } else if (lower.includes('మట్టి') || lower.includes('కుండ')) {
      category = 'Pottery & Ceramics';
      material = 'Natural Terracotta Clay';
      productName = 'Terracotta Clay Pot (మట్టి కుండ)';
      craftType = lower.includes('సార') ? 'Wheel-thrown / Hand-shaped' : 'Handcrafted / Molded';
    } else if (lower.includes('చీర') || lower.includes('చేనేత') || lower.includes('పట్టు') || lower.includes('కలంకారి') || lower.includes('ఇక్కత్')) {
      category = 'Handloom & Textiles';
      material = lower.includes('పట్టు') ? 'Pure Handloom Silk' : 'Handwoven Organic Cotton';
      productName = lower.includes('పట్టు') ? 'Handwoven Silk Saree (పట్టు చేనేత చీర)' : 'Traditional Handloom Saree (చేనేత చీర)';
      craftType = 'Handmade / Handwoven';
    } else if (lower.includes('చెక్క') || lower.includes('బొమ్మ')) {
      category = 'Wood Carving';
      material = 'Natural Seasoned Wood';
      productName = 'Handcarved Wooden Toy (చెక్క బొమ్మ)';
      craftType = 'Hand-carved / Chiseled';
    } else if (lower.includes('ఇత్తడి') || lower.includes('లోహం') || lower.includes('దీపం') || lower.includes('డోక్రా')) {
      category = 'Metal & Brass Craft';
      material = 'Traditional Cast Brass & Bronze';
      productName = lower.includes('దీపం') ? 'Traditional Brass Diya (ఇత్తడి దీపం)' : 'Handcrafted Brass Artpiece (ఇత్తడి శిల్పం)';
      craftType = lower.includes('డోక్రా') ? 'Lost-wax Bell Metal Casting' : 'Handcrafted Metal Casting';
    } else if (lower.includes('ఆభరణం') || lower.includes('నగలు')) {
      category = 'Artisanal Jewelry';
      material = 'Sterling Silver & Natural Stones';
      productName = 'Artisanal Handmade Jewelry (చేతితో చేసిన ఆభరణాలు)';
      craftType = 'Handcrafted / Filigree';
    }

    // 2. Making Time in Telugu
    for (const [teWord, num] of Object.entries(TELUGU_NUMBERS)) {
      if (lower.includes(`${teWord} రోజులు`) || lower.includes(`${teWord} దినాలు`)) {
        makingTime = `${num} days`;
        break;
      }
      if (lower.includes(`${teWord} గంటలు`)) {
        makingTime = `${num} hours`;
        break;
      }
      if (lower.includes(`${teWord} వారాలు`)) {
        makingTime = `${num} weeks`;
        break;
      }
    }
    const digitDayMatch = lower.match(/(\d+)\s*(?:రోజులు|దినాలు)/);
    if (digitDayMatch) {
      makingTime = `${digitDayMatch[1]} days`;
    }
    const digitHourMatch = lower.match(/(\d+)\s*గంటలు/);
    if (digitHourMatch) {
      makingTime = `${digitHourMatch[1]} hours`;
    }
    if (lower.includes('వారం')) {
      makingTime = '1 week';
    }

    const description = `Authentic ${productName} traditionally crafted from ${material}. Artisan voice transcript: "${raw}". Meticulously created with traditional techniques taking ${makingTime} to complete.`;

    return {
      productName,
      category,
      material,
      craftType,
      makingTime,
      size: size || 'Standard Handcrafted Size',
      description,
      teluguOriginal: raw,
      detectedLanguage: 'telugu',
      confidence: 0.95,
    };
  }

  // ================= ENGLISH NLP PARSING =================
  // 1. Making Time Extraction
  // Checks: "takes three days to make", "takes 3 days", "taking two days", "made in 16 hours", "took 4 days"
  const takesRegex = /(?:takes|taking|took|made in|duration of|takes around|it takes)\s+([a-z0-9\s]+?)(?:\s+to\s+(?:make|craft|weave|carve|finish|complete)|$|[.,])/i;
  const takesMatch = lower.match(takesRegex);
  if (takesMatch && takesMatch[1]) {
    const rawTime = takesMatch[1].trim();
    // Normalize words e.g. "three days" -> "3 days"
    let matchedDigits = '';
    for (const [word, val] of Object.entries(NUMBER_WORDS)) {
      if (rawTime.includes(word)) {
        matchedDigits = `${val} ${rawTime.replace(word, '').trim() || 'days'}`;
        break;
      }
    }
    if (!matchedDigits) {
      const dMatch = rawTime.match(/(\d+)\s*(days?|hours?|weeks?|months?)/);
      if (dMatch) {
        matchedDigits = `${dMatch[1]} ${dMatch[2]}`;
      } else {
        matchedDigits = rawTime;
      }
    }
    makingTime = matchedDigits.trim();
  } else {
    // Direct regex match for "X days" / "X hours" / "X weeks"
    const generalTimeMatch = lower.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a couple of)\s+(days?|hours?|weeks?)\b/i);
    if (generalTimeMatch) {
      const numPart = generalTimeMatch[1].toLowerCase();
      const unitPart = generalTimeMatch[2].toLowerCase();
      const numericVal = NUMBER_WORDS[numPart] !== undefined ? NUMBER_WORDS[numPart] : numPart;
      makingTime = `${numericVal} ${unitPart}`;
    }
  }

  // 2. Material Extraction
  // Checks: "made from natural bamboo", "made of pure silk", "crafted with natural terracotta clay"
  const materialRegex = /(?:made from|made of|crafted from|crafted with|using|made with)\s+([a-z\s]+?)(?=\s+(?:and it takes|which takes|taking|takes|and takes|took|with|for|\.|,|$))/i;
  const materialMatch = lower.match(materialRegex);
  if (materialMatch && materialMatch[1]) {
    const candidateMaterial = materialMatch[1].trim();
    if (candidateMaterial.length > 2 && candidateMaterial.length < 40) {
      material = toTitleCase(candidateMaterial);
    }
  } else {
    // Fallbacks based on keywords
    if (lower.includes('natural bamboo') || lower.includes('bamboo')) {
      material = 'Natural Bamboo';
    } else if (lower.includes('terracotta') || lower.includes('clay') || lower.includes('earthen')) {
      material = 'Natural Terracotta Clay';
    } else if (lower.includes('mulberry silk') || lower.includes('pure silk') || lower.includes('silk')) {
      material = 'Pure Handloom Silk';
    } else if (lower.includes('organic cotton') || lower.includes('khadi') || lower.includes('cotton')) {
      material = 'Handwoven Organic Cotton';
    } else if (lower.includes('teak wood') || lower.includes('sheesham') || lower.includes('wood')) {
      material = 'Seasoned Natural Wood';
    } else if (lower.includes('brass') || lower.includes('dokra') || lower.includes('bronze')) {
      material = 'Cast Brass & Bronze';
    } else if (lower.includes('jute')) {
      material = 'Natural Organic Jute';
    }
  }

  // 3. Category & Craft Type & Product Name
  if (lower.includes('bamboo') || lower.includes('cane') || lower.includes('basket') || lower.includes('wicker')) {
    category = 'Bamboo & Cane';
    craftType = 'Handmade / Handwoven';
    productName = 'Bamboo Basket';

    if (lower.includes('storage') || lower.includes('box')) {
      productName = 'Handwoven Bamboo Storage Basket';
    } else if (lower.includes('tray')) {
      productName = 'Handcrafted Bamboo Tray';
    } else if (lower.includes('lamp') || lower.includes('shade')) {
      productName = 'Woven Bamboo Lamp Shade';
    }
  } else if (lower.includes('pot') || lower.includes('clay') || lower.includes('terracotta') || lower.includes('pitcher') || lower.includes('vase')) {
    category = 'Pottery & Ceramics';
    craftType = lower.includes('wheel') ? 'Wheel-thrown / Hand-shaped' : 'Handcrafted Terracotta Pottery';
    productName = lower.includes('pitcher') ? 'Terracotta Water Pitcher' : 'Terracotta Clay Pot';
  } else if (lower.includes('saree') || lower.includes('handloom') || lower.includes('silk') || lower.includes('textile') || lower.includes('dupatta') || lower.includes('scarf')) {
    category = 'Handloom & Textiles';
    craftType = 'Handmade / Handwoven';
    if (lower.includes('saree')) {
      productName = lower.includes('silk') ? 'Handwoven Pure Silk Saree' : 'Traditional Handloom Saree';
    } else if (lower.includes('dupatta')) {
      productName = 'Handcrafted Handloom Dupatta';
    } else {
      productName = 'Handwoven Artisanal Textile';
    }
  } else if (lower.includes('wood') || lower.includes('carved') || lower.includes('elephant') || lower.includes('toy') || lower.includes('figurine')) {
    category = 'Wood Carving';
    craftType = 'Hand-carved / Chiseled';
    productName = lower.includes('elephant') ? 'Handcarved Wooden Elephant' : lower.includes('toy') ? 'Handcrafted Wooden Toy' : 'Handcarved Wooden Artpiece';
  } else if (lower.includes('brass') || lower.includes('metal') || lower.includes('dokra') || lower.includes('diya') || lower.includes('bell')) {
    category = 'Metal & Brass Craft';
    craftType = lower.includes('dokra') ? 'Traditional Lost-wax Casting' : 'Handcrafted Metal Casting';
    productName = lower.includes('diya') || lower.includes('lamp') ? 'Traditional Cast Brass Diya' : 'Handcrafted Brass Sculpture';
  } else if (lower.includes('jewelry') || lower.includes('necklace') || lower.includes('earring') || lower.includes('silver')) {
    category = 'Artisanal Jewelry';
    craftType = 'Handcrafted / Filigree';
    productName = 'Artisanal Handmade Jewelry';
  }

  // Refine product name from introductory clause if cleaner
  // e.g. "This is a handmade bamboo basket..." -> "Bamboo Basket"
  const introMatch = lower.match(/(?:this is|here is|i made|i have crafted)\s+(?:a|an)?\s*(?:handmade|handcrafted|handwoven|traditional|authentic)?\s*([a-z\s]+?)(?=\s+(?:made from|made of|crafted with|which takes|and it takes|taking|for|with)|$|[.,])/i);
  if (introMatch && introMatch[1]) {
    const rawName = introMatch[1].trim();
    // Clean up unnecessary modifiers
    const cleanedName = rawName
      .replace(/^(a|an|the|very|fine|unique)\s+/i, '')
      .trim();
    if (cleanedName.length >= 4 && cleanedName.length <= 35) {
      productName = toTitleCase(cleanedName);
    }
  }

  // Generate factual, descriptive English catalog summary
  const description = `Authentic ${productName.toLowerCase()} skillfully made from ${material.toLowerCase()}. This authentic piece is ${craftType.toLowerCase()} by regional master artisans, taking ${makingTime} of dedicated craftsmanship to complete.`;

  return {
    productName,
    category,
    material,
    craftType,
    makingTime,
    size: size || 'Standard Handcrafted Size',
    description,
    detectedLanguage: 'english',
    confidence: 0.96,
  };
};

/**
 * Translates a Telugu Cost & Effort transcript to clean English.
 */
export const translateTeluguCostVoice = (teluguText: string, extracted: Partial<ExtractedCostAndEffort>): string => {
  const parts: string[] = [];
  if (extracted.materialCost !== undefined) {
    parts.push(`Material cost is ${extracted.materialCost} rupees`);
  }
  if (extracted.laborCost !== undefined) {
    parts.push(`labor cost is ${extracted.laborCost} rupees`);
  } else if (extracted.laborHours !== undefined) {
    parts.push(`labor is ${extracted.laborHours} hours`);
  }
  if (extracted.packagingCost !== undefined) {
    parts.push(`packaging cost is ${extracted.packagingCost} rupees`);
  }
  if (extracted.otherCosts !== undefined) {
    parts.push(`other costs are ${extracted.otherCosts} rupees`);
  }
  if (extracted.existingPrice !== undefined) {
    parts.push(`current price is ${extracted.existingPrice} rupees`);
  }
  if (extracted.makingTime) {
    parts.push(`and it takes ${extracted.makingTime} to make`);
  }

  if (parts.length > 0) {
    return parts.join(', ') + '.';
  }

  // Fallback word replacement if no structured numbers were detected
  return teluguText
    .replace(/మెటీరియల్/g, 'material')
    .replace(/ముడి\s*సరుకు/g, 'raw material')
    .replace(/కూలి|శ్రమ|లేబర్/g, 'labor')
    .replace(/ఖర్చు/g, 'cost')
    .replace(/ప్యాకేజింగ్|ప్యాకింగ్/g, 'packaging')
    .replace(/ఇతర\s*ఖర్చులు/g, 'other costs')
    .replace(/ప్రస్తుత\s*ధర/g, 'current price')
    .replace(/రూపాయలు|రూ\./g, 'rupees')
    .replace(/రోజులు/g, 'days')
    .replace(/గంటలు/g, 'hours');
};

/**
 * Extracts Cost and Effort parameters from artisan voice input.
 * Example speech: "Raw materials cost 250 rupees and I worked for 16 hours"
 * Returns: { materialCost: 250, laborHours: 16, isIntricate: false }
 */
export const extractCostAndEffortFromVoice = (speechText: string): ExtractedCostAndEffort => {
  const raw = (speechText || '').trim();
  const lower = raw.toLowerCase();
  const isTelugu = /[\u0C00-\u0C7F]/.test(raw);
  const detectedLanguage: 'telugu' | 'english' = isTelugu ? 'telugu' : 'english';

  let materialCost: number | undefined;
  let laborCost: number | undefined;
  let laborHours: number | undefined;
  let makingTime: string | undefined;
  let packagingCost: number | undefined;
  let otherCosts: number | undefined;
  let existingPrice: number | undefined;
  let isIntricate = false;

  // 1. Material Cost Extraction
  const matPatterns = [
    /(?:raw\s*materials?|materials?|supplies|fabric|yarn|leather|bamboo|clay|terracotta|wood|silk|cotton|brass|copper|metal|silver(?:\s*(?:and|&)\s*stones?)?|gemstones?|stones?|gold)\s*(?:costs?|expenses?)?\s*(?:is|are|was|were|of|worth)?\s*(?:around|about|approximately)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)/i,
    /(?:spend|spent|paying|pay|invest|invested|costs?|worth)\s*(?:around|about)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:for|on)\s*(?:raw\s*materials?|materials?|supplies|fabric|yarn|leather|bamboo|clay|wood|silk|brass|copper|metal|silver|stones?)/i,
    /\b(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:for|on)?\s*(?:raw\s*materials?|materials?|material\s*cost|supplies|bamboo|clay|wood|silk)\b/i,
    /(?:మెటీరియల్|ముడి\s*సరుకు(?:లు|లకు)?|ముడిసరుకు(?:లు|లకు)?|సామగ్రి|వెదురు|మట్టి|పట్టు|చెక్క|వెండి|రాళ్ళు)\s*(?:ఖర్చు|ధర)?\s*(?:అయింది|అవుతుంది|గా)?\s*(?:సుమారు)?\s*(?:₹|రూ\.?)?\s*(\d+)/,
    /\b(\d+)\s*(?:రూపాయలు|రూ\.)\s*(?:మెటీరియల్|ముడి\s*సరుకు|సామగ్రి|వెదురు|మట్టి|పట్టు|చెక్క)/,
    /\b(\d+)\s*(?:రూపాయలు|రూ\.)\s*(?:మెటీరియల్\s*కోసం|ముడి\s*సరుకుల\s*కోసం)/,
  ];

  for (const pattern of matPatterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > 0 && val < 500000) {
        materialCost = val;
        break;
      }
    }
  }

  // 2. Labor Cost & Effort Extraction
  const laborCostPatterns = [
    /(?:labor|labour|artisan\s*effort|crafting\s*effort|making\s*effort|artisan\s*work|crafting\s*work|work\s*effort|wages?)\s*(?:costs?|charges?)?\s*(?:is|are|was|were|of|worth)?\s*(?:around|about|approximately)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)/i,
    /(?:spend|spent|pay|pays|paid)\s*(?:around|about)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:for|on)\s*(?:labor|labour|artisan\s*(?:effort|work)|crafting\s*(?:effort|work)|work|effort)/i,
    /(?:around|about)?\s*(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:for|on)\s*(?:labor|labour|artisan\s*(?:effort|work)|crafting\s*(?:effort|work)|work|wages?)/i,
    /\b(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:labor|labour)\s*cost/i,
    /(?:లేబర్|కూలి|శ్రమ|పని)\s*(?:ఖర్చు|ఛార్జ్)?\s*(?:అయింది|అవుతుంది|గా)?\s*(?:సుమారు)?\s*(?:₹|రూ\.?)?\s*(\d+)/,
    /\b(\d+)\s*(?:రూపాయలు|రూ\.)\s*(?:లేబర్|కూలి|శ్రమ|పని)/,
    /\b(\d+)\s*(?:రూపాయలు|రూ\.)\s*(?:లేబర్\s*కోసం|కూలి\s*కోసం)/,
  ];

  for (const pattern of laborCostPatterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > 0 && val < 500000) {
        laborCost = val;
        break;
      }
    }
  }

  // If labor hours specified (e.g. "worked for 16 hours", "16 hours of labor")
  const laborHoursPatterns = [
    /(?:worked|spent|labor|labour|effort|took)\s*(?:for)?\s*(\d+)\s*hours?/i,
    /\b(\d+)\s*hours?\s*(?:of)?\s*(?:work|labor|labour|effort|crafting)/i,
    /\b(\d+)\s*(?:గంటలు|గంటల)/,
    /(?:పని|శ్రమ)\s*(\d+)\s*గంటలు/,
  ];

  for (const pattern of laborHoursPatterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > 0 && val < 500) {
        laborHours = val;
        break;
      }
    }
  }

  // 3. Packaging Cost Extraction
  const packPatterns = [
    /(?:packaging|packing|packing\s*box(?:es)?|box(?:es)?|wrapping|package)\s*(?:costs?|expenses?|charges?)?\s*(?:is|are|was|were|of|worth)?\s*(?:around|about|approximately)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)/i,
    /(?:spend|spent|pay|paid|costs?)\s*(?:around|about)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:for|on)?\s*(?:packaging|packing|packing\s*box|box(?:es)?|wrapping)/i,
    /\b(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:for|on)\s*(?:packaging|packing|packing\s*box|box(?:es)?|wrapping)/i,
    /(?:ప్యాకేజింగ్|ప్యాకింగ్|బాక్స్|పెట్టె)\s*(?:ఖర్చు)?\s*(?:అయింది|అవుతుంది|గా)?\s*(?:సుమారు)?\s*(?:₹|రూ\.?)?\s*(\d+)/,
    /\b(\d+)\s*(?:రూపాయలు|రూ\.)\s*(?:ప్యాకేజింగ్|ప్యాకింగ్|బాక్స్|పెట్టె)/,
  ];

  for (const pattern of packPatterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val >= 0 && val < 50000) {
        packagingCost = val;
        break;
      }
    }
  }

  // 4. Other Production Costs Extraction
  const otherPatterns = [
    /(?:other\s*costs?|other\s*expenses?|additional\s*costs?|additional\s*expenses?|extra\s*costs?|extra\s*expenses?|transport(?:ation)?|delivery|electricity|fuel)\s*(?:costs?|expenses?)?\s*(?:is|are|was|were|of|worth)?\s*(?:around|about|approximately)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)/i,
    /\b(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:extra|additional)\b/i,
    /\b(\d+)\s*(?:rupees?|rs\.?|inr|₹)?\s*(?:for|on)\s*(?:other\s*costs?|other\s*expenses?|transport(?:ation)?|additional)/i,
    /(?:ఇతర\s*ఖర్చులు|ఇతర\s*వ్యయం|రవాణా|ట్రాన్స్పోర్ట్|అదనపు\s*ఖర్చులు)\s*(?:ఖర్చు)?\s*(?:అయింది|అవుతుంది|గా)?\s*(?:సుమారు)?\s*(?:₹|రూ\.?)?\s*(\d+)/,
    /\b(\d+)\s*(?:రూపాయలు|రూ\.)\s*(?:ఇతర\s*ఖర్చులు|రవాణా|అదనపు)/,
  ];

  for (const pattern of otherPatterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val >= 0 && val < 50000) {
        otherCosts = val;
        break;
      }
    }
  }

  // 5. Making Time Extraction
  const timeMatch = lower.match(/(?:it takes|takes|taking|took|made in|duration of|required|making time(?: is)?)\s+([a-z0-9\s]+?)(?:\s+to\s+(?:make|craft|weave|carve|finish|complete)|$|[.,])/i);
  if (timeMatch && timeMatch[1]) {
    const rawTime = timeMatch[1].trim();
    for (const [word, val] of Object.entries(NUMBER_WORDS)) {
      if (rawTime.includes(word)) {
        makingTime = `${val} ${rawTime.replace(word, '').trim() || 'days'}`.trim();
        break;
      }
    }
    if (!makingTime) {
      const dMatch = rawTime.match(/(\d+)\s*(days?|hours?|weeks?|months?)/i);
      if (dMatch) {
        makingTime = `${dMatch[1]} ${dMatch[2]}`;
      } else {
        makingTime = rawTime;
      }
    }
  } else {
    // Telugu making time phrases
    const teMatch = lower.match(/(?:తయారీ\s*సమయం|చేయడానికి|పూర్తి చేయడానికి)?\s*(\d+|ఒక|రెండు|మూడు|నాలుగు|ఐదు|ఆరు|ఏడు|ఎనిమిది|తొమ్మిది|పది)\s*(?:రోజులు|రోజుల|దినాలు|గంటలు)/);
    if (teMatch && teMatch[1]) {
      const val = TELUGU_NUMBERS[teMatch[1]] || teMatch[1];
      makingTime = `${val} days`;
    } else {
      const generalTime = lower.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(days?|hours?|weeks?)\b/i);
      if (generalTime) {
        const numPart = generalTime[1].toLowerCase();
        const unitPart = generalTime[2].toLowerCase();
        const numVal = NUMBER_WORDS[numPart] !== undefined ? NUMBER_WORDS[numPart] : numPart;
        makingTime = `${numVal} ${unitPart}`;
      }
    }
  }

  // 6. Artisan's Existing Selling Price (ONLY IF ARTISAN ACTUALLY MENTIONS ONE)
  const existingPricePatterns = [
    /(?:currently\s*sell(?:ing)?(?:\s+it)?(?:\s+for)?|current\s*selling\s*price|my\s*current\s*price|current\s*price|selling\s*price|i\s*sell\s*it\s*for|my\s*price\s*is|i\s*charge)\s*(?:around|about|is|of|was)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+)/i,
    /\b(\d+)\s*(?:rupees?|rs\.?|inr|₹)\s*(?:is\s*my\s*selling\s*price|is\s*the\s*current\s*price|is\s*what\s*i\s*sell\s*it\s*for)/i,
    /(?:ప్రస్తుత\s*ధర|నేను\s*అమ్ముతున్న\s*ధర|అమ్మే\s*ధర|ప్రస్తుతం)\s*(?:సుమారు|గా)?\s*(?:₹|రూ\.?)?\s*(\d+)/,
    /\b(\d+)\s*(?:రూపాయలు|రూ\.)\s*(?:ప్రస్తుత\s*ధర|నేను\s*అమ్ముతున్న|అమ్మే\s*ధర)/,
  ];

  for (const pattern of existingPricePatterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > 0 && val < 1000000) {
        existingPrice = val;
        break;
      }
    }
  }

  // Intricacy
  if (
    lower.includes('intricate') ||
    lower.includes('fine work') ||
    lower.includes('complex') ||
    lower.includes('filigree') ||
    lower.includes('detailed') ||
    lower.includes('సంక్లిష్ట') ||
    lower.includes('నైపుణ్యం')
  ) {
    isIntricate = true;
  }

  const parts: string[] = [];
  if (materialCost !== undefined) parts.push(`₹${materialCost} material`);
  if (laborCost !== undefined) parts.push(`₹${laborCost} labor`);
  else if (laborHours !== undefined) parts.push(`${laborHours} hrs labor`);
  if (packagingCost !== undefined) parts.push(`₹${packagingCost} packaging`);
  if (otherCosts !== undefined) parts.push(`₹${otherCosts} other costs`);
  if (makingTime) parts.push(`time: ${makingTime}`);
  if (existingPrice !== undefined) parts.push(`artisan current price: ₹${existingPrice}`);

  const explanation = parts.length > 0
    ? `Extracted structured costs from voice: ${parts.join(', ')}.`
    : 'No clear numeric costs detected. Please state e.g. "Material cost is 800 rupees, labor cost is 600 rupees, packaging cost is 100 rupees, other costs are 50 rupees, my current price is 2200 rupees, and it takes 4 days to make."';

  let teluguOriginal: string | undefined;
  let englishTranslation: string | undefined;

  if (isTelugu) {
    teluguOriginal = raw;
    englishTranslation = translateTeluguCostVoice(raw, {
      materialCost,
      laborCost,
      laborHours,
      makingTime,
      packagingCost,
      otherCosts,
      existingPrice,
    });
  } else {
    englishTranslation = raw;
  }

  return {
    materialCost,
    laborCost,
    laborHours,
    makingTime,
    packagingCost,
    otherCosts,
    existingPrice,
    isIntricate,
    rawText: raw,
    teluguOriginal,
    englishTranslation,
    detectedLanguage,
    explanation,
  };
};

/**
 * Backwards compatibility wrapper for translateTeluguCraftDescription
 */
export const translateTeluguCraftDescription = (
  input: string
): { englishTitle: string; englishDescription: string; detectedCategory: string; detectedMaterial: string } => {
  const details = extractProductDetailsFromVoice(input);
  return {
    englishTitle: details.productName,
    englishDescription: details.description,
    detectedCategory: details.category,
    detectedMaterial: details.material,
  };
};

