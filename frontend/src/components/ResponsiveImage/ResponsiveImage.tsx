import React, { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import LazyImage from '../LazyImage';

interface ResponsiveImageProps extends Omit<BoxProps, 'component'> {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  width?: string | number;
  height?: string | number;
  aspectRatio?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  placeholderSrc?: string;
}

const ResponsiveImage: FC<ResponsiveImageProps> = ({
  src,
  alt,
  srcSet,
  sizes = '100vw',
  width,
  height,
  aspectRatio = '16/9',
  objectFit = 'cover',
  loading = 'lazy',
  sx,
  ...rest
}) => {
  // If we have a srcSet, use the responsive image pattern
  if (srcSet) {
    return (
      <Box
        sx={{
          width,
          height,
          aspectRatio,
          overflow: 'hidden',
          ...sx
        }}
        {...rest}
      >
        <Box
          component="img"
          src={src}
          alt={alt}
          srcSet={srcSet}
          sizes={sizes}
          loading={loading}
          sx={{
            width: '100%',
            height: '100%',
            objectFit,
            display: 'block',
          }}
        />
      </Box>
    );
  }

  // If no srcSet, use the LazyImage component for lazy loading
  return (
    <LazyImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      objectFit={objectFit}
      sx={{
        aspectRatio,
        ...sx
      }}
      {...rest}
    />
  );
};

export default ResponsiveImage; 