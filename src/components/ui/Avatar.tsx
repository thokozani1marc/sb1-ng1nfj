import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback: string;
}

export function Avatar({ src, alt, fallback }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
      <span className="text-sm font-medium text-white">
        {fallback.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}