// src/components/BackgroundImageWrapper.tsx
import React, { FC } from 'react';
import { ImageBackground, StyleSheet, ViewProps } from 'react-native';

interface BackgroundImageWrapperProps extends ViewProps {
  children: React.ReactNode;
}

const BackgroundImageWrapper: FC<BackgroundImageWrapperProps> = ({ children, ...props }) => {
  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.backgroundImage}
      {...props}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackgroundImageWrapper;
