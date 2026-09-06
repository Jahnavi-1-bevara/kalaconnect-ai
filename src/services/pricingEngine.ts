import { SuggestedPriceRange, ProductionCostBreakdown } from '../types';

export interface PricingFactors {
  category?: string;
  material?: string;
  size?: string;
  craftType?: string;
  makingTime?: string;
  productName?: string;
  description?: string;

  materialCost?: number | null;
  laborCost?: number | null;
  laborHours?: number | null;
  packagingCost?: number | null;
  otherCosts?: number | null;
  existingPrice?: number | null;
  artisanCurrentPrice?: number | null;

  baseMaterialCost?: number; // legacy alias
  hourlyRate?: number;
  isIntricate?: boolean;
}

/**
 * Psychological retail price calculation (e.g. ₹1,299, ₹749, ₹2,399)
 */
export const formatPsychologicalPrice = (target: number): number => {
  if (target <= 100) return Math.max(50, Math.round(target));
  const nearest50 = Math.round(target / 50) * 50;
  return nearest50 > 100 ? nearest50 - 1 : nearest50;
};

/**
 * Calculates meaningful AI Estimated Price based on Product Information + Cost & Effort inputs
 */
export const calculateSuggestedPriceRange = (factors: PricingFactors): SuggestedPriceRange => {
  const cat = (factors.category || '').toLowerCase();
  const mat = (factors.material || '').toLowerCase();
  const craft = (factors.craftType || '').toLowerCase();
  const time = (factors.makingTime || '').toLowerCase();
  const size = (factors.size || '').toLowerCase();

  // 1. Structured Cost Extraction
  const matCost =
    factors.materialCost !== undefined && factors.materialCost !== null
      ? Number(factors.materialCost)
      : factors.baseMaterialCost !== undefined && factors.baseMaterialCost > 0
      ? Number(factors.baseMaterialCost)
      : null;

  let labCost =
    factors.laborCost !== undefined && factors.laborCost !== null
      ? Number(factors.laborCost)
      : null;

  // Fallback hourly rate if artisan specified labor hours rather than direct cost
  const defaultHourlyRate = factors.hourlyRate || 120;
  if (labCost === null && factors.laborHours !== undefined && factors.laborHours !== null && factors.laborHours > 0) {
    labCost = Math.round(Number(factors.laborHours) * defaultHourlyRate);
  }

  const packCost =
    factors.packagingCost !== undefined && factors.packagingCost !== null
      ? Number(factors.packagingCost)
      : null;

  const otherCost =
    factors.otherCosts !== undefined && factors.otherCosts !== null
      ? Number(factors.otherCosts)
      : 0;

  const rawExistingPrice = factors.artisanCurrentPrice ?? factors.existingPrice;
  const existingPrice =
    rawExistingPrice !== undefined && rawExistingPrice !== null && Number(rawExistingPrice) > 0
      ? Number(rawExistingPrice)
      : null;

  // Determine if enough information is provided
  const hasEnoughInfo = (matCost !== null && matCost > 0) || (labCost !== null && labCost > 0);

  // Missing information guidance message
  let missingInformationMessage: string | undefined;
  if (!hasEnoughInfo) {
    missingInformationMessage =
      'More information needed: Add material cost and approximate making effort to generate a better price estimate.';
  }

  // 2. Production Cost Calculation
  // Fallback defaults only if NO inputs were provided at all, for sensible previewing
  const effectiveMatCost = matCost !== null ? matCost : 250;
  const effectiveLabCost = labCost !== null ? labCost : 350;
  const effectivePackCost = packCost !== null ? packCost : 0;
  const effectiveOtherCost = otherCost !== null ? otherCost : 0;

  const totalProductionCost = hasEnoughInfo
    ? (matCost || 0) + (labCost || 0) + (packCost || 0) + (otherCost || 0)
    : null;

  const calculationCostBase = hasEnoughInfo
    ? (totalProductionCost || 1)
    : effectiveMatCost + effectiveLabCost + effectivePackCost + effectiveOtherCost;

  // 3. AI Craft Markup Multiplier
  // 3. AI Craft Markup Multiplier
  // Base fair trade margin: 30% gross profit for artisan
  let baseMultiplier = 1.30;

  // Category adjustments (fragility, specialization, tool depreciation)
  if (cat.includes('bamboo') || cat.includes('cane')) {
    baseMultiplier += 0.15;
  } else if (cat.includes('pottery') || cat.includes('ceramic') || cat.includes('terracotta') || cat.includes('clay')) {
    baseMultiplier += 0.15;
  } else if (cat.includes('jewelry') || cat.includes('jewellery')) {
    baseMultiplier += 0.20;
  } else if (cat.includes('textile') || cat.includes('saree') || cat.includes('handloom') || cat.includes('silk')) {
    baseMultiplier += 0.18;
  } else if (cat.includes('wood') || cat.includes('carving')) {
    baseMultiplier += 0.15;
  } else if (cat.includes('metal') || cat.includes('brass') || cat.includes('dokra')) {
    baseMultiplier += 0.16;
  } else {
    baseMultiplier += 0.12;
  }

  // Material adjustments (premium fibers, seasoned wood, noble metals)
  if (mat.includes('silk')) baseMultiplier += 0.08;
  else if (mat.includes('silver') || mat.includes('gem') || mat.includes('stone')) baseMultiplier += 0.04;
  else if (mat.includes('brass') || mat.includes('bronze')) baseMultiplier += 0.04;
  else if (mat.includes('teak') || mat.includes('rosewood')) baseMultiplier += 0.04;

  // Craft Type / Technique adjustments
  if (craft.includes('woven') || craft.includes('handloom')) baseMultiplier += 0.05;
  else if (craft.includes('carved') || craft.includes('chisel')) baseMultiplier += 0.05;
  else if (craft.includes('wheel') || craft.includes('thrown')) baseMultiplier += 0.05;
  else if (craft.includes('lost-wax') || craft.includes('dokra') || craft.includes('cast')) baseMultiplier += 0.06;
  else if (craft.includes('filigree')) baseMultiplier += 0.03;

  // Making Time adjustments (handcrafted duration premium)
  if (time.includes('7 days') || time.includes('week') || time.includes('weeks')) {
    baseMultiplier += 0.12;
  } else if (time.includes('3 days') || time.includes('4 days') || time.includes('5 days') || time.includes('6 days')) {
    baseMultiplier += 0.08;
  } else if (time.includes('2 days') || time.includes('16 hours')) {
    baseMultiplier += 0.03;
  } else if (time.includes('1 day') || time.includes('8 hours') || time.includes('one day') || time.includes('day')) {
    baseMultiplier += 0.03;
  }

  // Size adjustments
  if (size.includes('large') || size.includes('xl') || size.includes('big')) {
    baseMultiplier += 0.05;
  }

  if (factors.isIntricate) {
    baseMultiplier += 0.08;
  }

  // 4. Calculate AI Estimated Price Range & Recommended Price
  const targetPrice = calculationCostBase * baseMultiplier;
  const roundedTarget = Math.round(targetPrice / 50) * 50;
  const minSpread = roundedTarget >= 2000 ? 300 : roundedTarget >= 1000 ? 200 : 100;
  const maxSpread = roundedTarget >= 2000 ? 300 : 100;
  const min = Math.max(50, roundedTarget - minSpread);
  const max = roundedTarget + maxSpread;
  const recommendedPrice = formatPsychologicalPrice(targetPrice);

  // 5. Human-Friendly Explanation
  const explanation = hasEnoughInfo
    ? `This recommendation considers your material cost (₹${matCost || 0}), labor & making effort (₹${labCost || 0})${packCost !== null ? `, packaging (₹${packCost})` : ''}, production time (${factors.makingTime || 'handcrafted'}), artisanal technique, and a sustainable craft margin. You maintain 100% control over your final price.`
    : `This recommendation considers standard material benchmarks, making effort, handcrafted nature, packaging, and product complexity. Add your actual costs for an exact estimate.`;

  const productionCostBreakdown: ProductionCostBreakdown = {
    materialCost: matCost,
    laborCost: labCost,
    packagingCost: packCost,
    otherCosts: otherCost > 0 ? otherCost : (factors.otherCosts !== undefined ? factors.otherCosts : null),
    totalProductionCost,
    isComplete: hasEnoughInfo,
  };

  return {
    min,
    max,
    recommendedPrice,
    explanation,
    productionCost: productionCostBreakdown,
    artisanCurrentPrice: existingPrice,
    hasEnoughInfo,
    missingInformationMessage,
    costBreakdown: {
      materials: matCost || effectiveMatCost,
      laborHours: factors.laborHours || Math.round((labCost || effectiveLabCost) / defaultHourlyRate),
      laborRate: defaultHourlyRate,
      craftSkillMultiplier: Math.round(baseMultiplier * 100) / 100,
      suggestedMargin: Math.round(recommendedPrice - (totalProductionCost || calculationCostBase)),
    },
  };
};
