import React, { useState, useEffect, useRef, FC } from 'react';
import { Box, Skeleton, BoxProps } from '@mui/material';

interface LazyImageProps extends Omit<BoxProps, 'component'> {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  placeholderHeight?: string | number;
  placeholderWidth?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const LazyImage: FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholderHeight = height || '100%',
  placeholderWidth = width || '100%',
  objectFit = 'cover',
  sx,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load images 200px before they come into view
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Box ref={imgRef} position="relative" width={width} height={height} {...rest}>
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width={placeholderWidth}
          height={placeholderHeight}
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            ...sx,
          }}
        />
      )}
      {isInView && (
        <Box
          component="img"
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          sx={{
            width: '100%',
            height: '100%',
            objectFit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            ...sx,
          }}
        />
      )}
    </Box>
  );
};

export default LazyImage; 