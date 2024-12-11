// src/components/withBackgroundImage.tsx
import React from 'react';
import BackgroundImageWrapper from './BackgroundImageWrapper';

const withBackgroundImage = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  return (props: P) => (
    <BackgroundImageWrapper>
      <Component {...props} />
    </BackgroundImageWrapper>
  );
};

export default withBackgroundImage;
