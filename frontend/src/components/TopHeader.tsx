// src/components/TopHeader.tsx
import React from 'react';
import { User, ArrowLeft } from 'lucide-react';

interface TopHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  subtitleRight?: string;
  onProfileClick?: () => void;
  username?: string | null;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  onProfileClick,
  username,
}) => {
  const getDisplayName = () => {
    if (username?.trim()) {
      return username
    }
    // 2. Fallback to localStorage 'username' if prop isn't ready yet
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      return savedUsername;
    }
    return "User";
  };

  return (
    <div className="flex justify-between items-center mb-5">
      {showBackButton ? (
        <button onClick={onBackClick} className="text-white hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-7 h-7 stroke-[2]" />
        </button>
      ) : null}

      {!showBackButton && !title ? (
        <div>
          <p className="text-gray-400 text-3xl font-normal tracking-tight">Hello</p>
          <h1 className="text-3xl font-semibold text-white tracking-wide mt-0.5">
            {getDisplayName()}
          </h1>
        </div>
      ) : (
        title && <h2 className="text-2xl font-medium tracking-wide text-white">{title}</h2>
      )}

      {/* Linked active profile execution context */}
      <button 
        onClick={onProfileClick} 
        className="text-white hover:opacity-80 transition-opacity"
      >
        <User className="w-8 h-8 stroke-[1.5]" />
      </button>
    </div>
  );
};