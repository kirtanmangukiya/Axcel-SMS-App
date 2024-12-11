// src/components/BackgroundImageContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ImageSourcePropType } from 'react-native';

interface BackgroundImageContextType {
  backgroundImage: ImageSourcePropType;
  setBackgroundImage: (image: ImageSourcePropType) => void;
}

const BackgroundImageContext = createContext<BackgroundImageContextType | undefined>(undefined);

export const BackgroundImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState<ImageSourcePropType>(require('../assest/icons/SideBarBg.jpg')); // Default image

  return (
    <BackgroundImageContext.Provider value={{ backgroundImage, setBackgroundImage }}>
      {children}
    </BackgroundImageContext.Provider>
  );
};

export const useBackgroundImage = () => {
  const context = useContext(BackgroundImageContext);
  if (context === undefined) {
    throw new Error('useBackgroundImage must be used within a BackgroundImageProvider');
  }
  return context;
};
