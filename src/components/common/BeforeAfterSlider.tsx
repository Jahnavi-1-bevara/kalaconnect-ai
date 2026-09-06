import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatio?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Photo',
  afterLabel = 'AI Studio Enhanced',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl bg-craft-charcoal/5 border border-craft-sand shadow-craft-md cursor-ew-resize group ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      role="slider"
      aria-valuenow={sliderPosition}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Before and after image comparison"
    >
      {/* After Image (Background layer) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* Before Image (Clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Draggable Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Button */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-craft-charcoal shadow-craft-lg flex items-center justify-center border-2 border-craft-terracotta transition-transform group-hover:scale-110">
          <div className="flex items-center space-x-0.5">
            <span className="w-1 h-3 bg-craft-terracotta rounded-full"></span>
            <span className="w-1 h-4 bg-craft-charcoal rounded-full"></span>
            <span className="w-1 h-3 bg-craft-terracotta rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Floating Badges */}
      <div className="absolute top-4 left-4 bg-craft-charcoal/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
        <ImageIcon className="w-3.5 h-3.5 text-craft-sand" />
        <span>{beforeLabel}</span>
      </div>

      <div className="absolute top-4 right-4 bg-craft-terracotta text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{afterLabel}</span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-craft-charcoal/70 backdrop-blur-sm text-white/90 text-[11px] px-3 py-0.5 rounded-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        Drag slider left or right to inspect
      </div>
    </div>
  );
};
