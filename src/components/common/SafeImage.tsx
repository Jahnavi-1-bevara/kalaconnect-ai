import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Craft item',
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const displaySrc = error || !src ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden bg-craft-sand/20 ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-craft-stone animate-pulse flex items-center justify-center">
          <span className="text-xs text-craft-muted/60">Loading craft...</span>
        </div>
      )}
      <img
        {...props}
        src={displaySrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
};
