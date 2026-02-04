
import React, { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = 'md' }) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  if (hasError || !src) {
    return (
      <div
        className={`rounded-full bg-slate-600 flex items-center justify-center font-bold text-white ${sizeClasses[size]}`}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${sizeClasses[size]}`}
      onError={() => setHasError(true)}
    />
  );
};

export default Avatar;
