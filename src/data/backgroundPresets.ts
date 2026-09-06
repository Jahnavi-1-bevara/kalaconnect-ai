import { BackgroundPreset } from '../types';

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'smart-match',
    name: 'Smart AI Match',
    description: 'Auto-adapts lighting, surface tone, and backdrop texture to the craft category.',
    categoryFit: ['all'],
    type: 'studio',
    previewUrl: '',
    shadowBlur: 25,
    shadowOpacity: 0.35,
    shadowYOffset: 15,
    renderBackground: (ctx, width, height) => {
      // Dynamic ambient warm studio lighting with soft tabletop horizon
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#EAE2D7');
      bgGrad.addColorStop(0.65, '#DFCFC0');
      bgGrad.addColorStop(1, '#CEBBA8');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Studio spotlight glow
      const radial = ctx.createRadialGradient(width * 0.5, height * 0.45, 20, width * 0.5, height * 0.45, width * 0.7);
      radial.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Warm wooden/stone surface baseline
      const tableGrad = ctx.createLinearGradient(0, height * 0.7, 0, height);
      tableGrad.addColorStop(0, 'rgba(180, 155, 130, 0.35)');
      tableGrad.addColorStop(0.05, 'rgba(150, 125, 100, 0.6)');
      tableGrad.addColorStop(1, 'rgba(120, 95, 75, 0.8)');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);

      // Surface bevel highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      ctx.lineTo(width, height * 0.7);
      ctx.stroke();
    },
  },
  {
    id: 'tech-minimal',
    name: 'Minimal Tech & Product Studio',
    description: 'Sleek matte graphite podium with architectural rim lighting, designed for mice, gadgets & tools.',
    categoryFit: ['mouse', 'tech', 'electronics', 'gadget', 'product', 'device'],
    type: 'luxury',
    previewUrl: '',
    shadowBlur: 20,
    shadowOpacity: 0.45,
    shadowYOffset: 12,
    renderBackground: (ctx, width, height) => {
      // Clean modern gradient backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#24282B');
      bgGrad.addColorStop(0.65, '#1A1D1F');
      bgGrad.addColorStop(1, '#121415');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft overhead directional spotlight
      const spot = ctx.createRadialGradient(width * 0.5, height * 0.35, 15, width * 0.5, height * 0.4, width * 0.65);
      spot.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      spot.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, width, height);

      // Matte dark graphite pedestal
      const podY = height * 0.68;
      const podGrad = ctx.createLinearGradient(0, podY, 0, height);
      podGrad.addColorStop(0, '#2A2E32');
      podGrad.addColorStop(0.1, '#202326');
      podGrad.addColorStop(1, '#151719');
      ctx.fillStyle = podGrad;
      ctx.fillRect(0, podY, width, height - podY);

      // Crisp top bevel line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, podY);
      ctx.lineTo(width, podY);
      ctx.stroke();
    },
  },
  {
    id: 'premium-pottery',
    name: 'Premium Craft Studio',
    description: 'Earthy ceramic studio setting with warm terracotta hues and focused museum spotlight.',
    categoryFit: ['Pottery & Ceramics', 'pottery', 'ceramics', 'terracotta'],
    type: 'studio',
    previewUrl: '',
    shadowBlur: 30,
    shadowOpacity: 0.4,
    shadowYOffset: 18,
    renderBackground: (ctx, width, height) => {
      // Warm earthen studio
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#EDE4DC');
      bgGrad.addColorStop(0.6, '#D8C6B6');
      bgGrad.addColorStop(1, '#BEA490');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Museum spotlight
      const spot = ctx.createRadialGradient(width * 0.52, height * 0.4, 40, width * 0.5, height * 0.45, width * 0.6);
      spot.addColorStop(0, 'rgba(255, 252, 245, 0.6)');
      spot.addColorStop(0.7, 'rgba(245, 230, 215, 0.2)');
      spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, width, height);

      // Terracotta pedestal platform
      const pedY = height * 0.72;
      const pedGrad = ctx.createLinearGradient(0, pedY, 0, height);
      pedGrad.addColorStop(0, '#C85A32');
      pedGrad.addColorStop(0.1, '#B04B26');
      pedGrad.addColorStop(1, '#7E3014');
      ctx.fillStyle = pedGrad;
      ctx.fillRect(0, pedY, width, height - pedY);

      // Edge glow
      ctx.strokeStyle = 'rgba(255, 210, 185, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, pedY);
      ctx.lineTo(width, pedY);
      ctx.stroke();
    },
  },
  {
    id: 'natural-bamboo',
    name: 'Natural Craft Studio',
    description: 'Soft linen textile backdrop with organic bamboo & botanical diffused morning light.',
    categoryFit: ['Bamboo & Cane', 'bamboo', 'cane', 'natural_fiber', 'jute'],
    type: 'nature',
    previewUrl: '',
    shadowBlur: 22,
    shadowOpacity: 0.32,
    shadowYOffset: 14,
    renderBackground: (ctx, width, height) => {
      // Natural soft sage and warm linen backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#F6F7F3');
      bgGrad.addColorStop(0.55, '#E8EBE3');
      bgGrad.addColorStop(1, '#D5DDD0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft sunlit window pattern
      const sun = ctx.createRadialGradient(width * 0.3, height * 0.25, 30, width * 0.4, height * 0.35, width * 0.8);
      sun.addColorStop(0, 'rgba(255, 255, 240, 0.55)');
      sun.addColorStop(0.6, 'rgba(235, 245, 230, 0.25)');
      sun.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, width, height);

      // Natural raw wood cane platform
      const baseGrad = ctx.createLinearGradient(0, height * 0.68, 0, height);
      baseGrad.addColorStop(0, '#D9C5A8');
      baseGrad.addColorStop(0.2, '#CBB494');
      baseGrad.addColorStop(1, '#A99170');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, height * 0.68, width, height * 0.32);

      // Edge highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.68);
      ctx.lineTo(width, height * 0.68);
      ctx.stroke();
    },
  },
  {
    id: 'heritage-indian',
    name: 'Traditional Indian Craft Setting',
    description: 'Aged Indian teakwood table with deep raw silk backdrop and subtle brass accents.',
    categoryFit: ['Metal & Brass Craft', 'Wood Carving', 'brass', 'bronze', 'dokra', 'wood'],
    type: 'heritage',
    previewUrl: '',
    shadowBlur: 28,
    shadowOpacity: 0.42,
    shadowYOffset: 16,
    renderBackground: (ctx, width, height) => {
      // Deep warm heritage backdrop (raw silk burgundy/warm amber)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#3A201A');
      bgGrad.addColorStop(0.5, '#2A1713');
      bgGrad.addColorStop(1, '#1A0E0B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Warm brass glow
      const brassGlow = ctx.createRadialGradient(width * 0.5, height * 0.38, 30, width * 0.5, height * 0.4, width * 0.55);
      brassGlow.addColorStop(0, 'rgba(212, 168, 83, 0.45)');
      brassGlow.addColorStop(0.5, 'rgba(184, 134, 11, 0.18)');
      brassGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = brassGlow;
      ctx.fillRect(0, 0, width, height);

      // Handcrafted Indian Teakwood tabletop
      const tableY = height * 0.68;
      const woodGrad = ctx.createLinearGradient(0, tableY, 0, height);
      woodGrad.addColorStop(0, '#4E2F1E');
      woodGrad.addColorStop(0.1, '#3A2113');
      woodGrad.addColorStop(1, '#24140B');
      ctx.fillStyle = woodGrad;
      ctx.fillRect(0, tableY, width, height - tableY);

      // Fine brass border inlay line
      ctx.strokeStyle = 'rgba(218, 165, 32, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, tableY);
      ctx.lineTo(width, tableY);
      ctx.stroke();
    },
  },
  {
    id: 'minimal-luxury',
    name: 'Minimal Luxury Studio',
    description: 'Polished travertine stone pedestal with contemporary architectural museum lighting.',
    categoryFit: ['Artisanal Jewelry', 'jewelry', 'silver', 'luxury', 'precious'],
    type: 'luxury',
    previewUrl: '',
    shadowBlur: 24,
    shadowOpacity: 0.3,
    shadowYOffset: 12,
    renderBackground: (ctx, width, height) => {
      // Smooth cool-neutral minimal luxury gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#F5F5F7');
      bgGrad.addColorStop(0.65, '#E5E5EA');
      bgGrad.addColorStop(1, '#D1D1D6');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Focused spot
      const spot = ctx.createRadialGradient(width * 0.5, height * 0.35, 10, width * 0.5, height * 0.4, width * 0.5);
      spot.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      spot.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, width, height);

      // Travertine podium
      const podY = height * 0.7;
      const podGrad = ctx.createLinearGradient(0, podY, 0, height);
      podGrad.addColorStop(0, '#ECEBE8');
      podGrad.addColorStop(0.2, '#DFDDD8');
      podGrad.addColorStop(1, '#C9C7C1');
      ctx.fillStyle = podGrad;
      ctx.fillRect(0, podY, width, height - podY);

      // Top crisp bevel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, podY);
      ctx.lineTo(width, podY);
      ctx.stroke();
    },
  },
  {
    id: 'soft-beige',
    name: 'Soft Beige Studio',
    description: 'Harmonious warm sand tones, organic gentle curves, and calming ambient warmth.',
    categoryFit: ['Home Decor', 'decor', 'craft', 'textiles'],
    type: 'beige',
    previewUrl: '',
    shadowBlur: 26,
    shadowOpacity: 0.28,
    shadowYOffset: 14,
    renderBackground: (ctx, width, height) => {
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#F9F5F0');
      bgGrad.addColorStop(0.5, '#F1E9DE');
      bgGrad.addColorStop(1, '#E4D8C8');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft sunlit aura
      const aura = ctx.createRadialGradient(width * 0.48, height * 0.42, 20, width * 0.5, height * 0.45, width * 0.65);
      aura.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      aura.addColorStop(1, 'rgba(235, 220, 205, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Clay sand table
      const tY = height * 0.72;
      const tableGrad = ctx.createLinearGradient(0, tY, 0, height);
      tableGrad.addColorStop(0, '#D9C8B5');
      tableGrad.addColorStop(0.1, '#CDB8A2');
      tableGrad.addColorStop(1, '#B9A189');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, tY, width, height - tY);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, tY);
      ctx.lineTo(width, tY);
      ctx.stroke();
    },
  },
  {
    id: 'lifestyle-textile',
    name: 'Lifestyle Setting',
    description: 'Aesthetic modern living interior with sunlit artisanal oak and soft fabric drapery.',
    categoryFit: ['Handloom & Textiles', 'textiles', 'saree', 'shawl', 'fabric', 'apparel'],
    type: 'lifestyle',
    previewUrl: '',
    shadowBlur: 24,
    shadowOpacity: 0.32,
    shadowYOffset: 15,
    renderBackground: (ctx, width, height) => {
      // Warm modern interior wall
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#F4EDE4');
      bgGrad.addColorStop(0.6, '#E7DBCF');
      bgGrad.addColorStop(1, '#D8C6B6');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Sunlight stream from window
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width * 0.6, 0);
      ctx.lineTo(width, height * 0.8);
      ctx.lineTo(width * 0.2, height);
      ctx.closePath();
      const sunbeam = ctx.createLinearGradient(0, 0, width, height);
      sunbeam.addColorStop(0, 'rgba(255, 255, 245, 0.35)');
      sunbeam.addColorStop(0.8, 'rgba(255, 245, 225, 0.1)');
      sunbeam.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunbeam;
      ctx.fill();
      ctx.restore();

      // Oakwood display credenza
      const cY = height * 0.7;
      const credGrad = ctx.createLinearGradient(0, cY, 0, height);
      credGrad.addColorStop(0, '#BF9E77');
      credGrad.addColorStop(0.08, '#A9865F');
      credGrad.addColorStop(1, '#7C5C38');
      ctx.fillStyle = credGrad;
      ctx.fillRect(0, cY, width, height - cY);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, cY);
      ctx.lineTo(width, cY);
      ctx.stroke();
    },
  },
  {
    id: 'transparent-png',
    name: 'Transparent Background',
    description: 'Clean transparent PNG cutout. Ideal for catalogs, transparent banners, or custom collages.',
    categoryFit: ['all'],
    type: 'transparent',
    previewUrl: '',
    shadowBlur: 0,
    shadowOpacity: 0,
    shadowYOffset: 0,
    renderBackground: (ctx, width, height) => {
      // Clear transparent background
      ctx.clearRect(0, 0, width, height);
    },
  },
];

export const getRecommendedBackground = (category: string = ''): BackgroundPreset => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('mouse') || cat.includes('tech') || cat.includes('electronic') || cat.includes('gadget') || cat.includes('accessory')) {
    return BACKGROUND_PRESETS[1]; // Tech & Product Minimal Studio
  }
  if (cat.includes('pottery') || cat.includes('ceramic') || cat.includes('terracotta') || cat.includes('clay')) {
    return BACKGROUND_PRESETS[2]; // Premium Craft Studio
  }
  if (cat.includes('bamboo') || cat.includes('cane') || cat.includes('jute') || cat.includes('fiber')) {
    return BACKGROUND_PRESETS[3]; // Natural Craft Studio
  }
  if (cat.includes('metal') || cat.includes('brass') || cat.includes('wood') || cat.includes('carving') || cat.includes('dokra')) {
    return BACKGROUND_PRESETS[4]; // Traditional Indian Craft Setting
  }
  if (cat.includes('jewelry') || cat.includes('silver') || cat.includes('bead')) {
    return BACKGROUND_PRESETS[5]; // Minimal Luxury Studio
  }
  if (cat.includes('textile') || cat.includes('saree') || cat.includes('shawl') || cat.includes('handloom') || cat.includes('silk')) {
    return BACKGROUND_PRESETS[7]; // Lifestyle Setting
  }
  return BACKGROUND_PRESETS[0]; // Smart AI Match
};
