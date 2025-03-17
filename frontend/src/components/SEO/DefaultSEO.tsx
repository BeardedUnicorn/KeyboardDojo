import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface DefaultSEOProps {
  siteTitle?: string;
  siteDescription?: string;
  siteUrl?: string;
}

const DefaultSEO: FC<DefaultSEOProps> = ({
  siteTitle = 'Keyboard Dojo - Master Keyboard Shortcuts & Boost Productivity',
  siteDescription = 'Learn and master keyboard shortcuts for your favorite applications. Boost your productivity with interactive lessons and practice sessions.',
  siteUrl = import.meta.env.VITE_APP_URL || 'https://keyboarddojo.com',
}) => {
  return (
    <Helmet>
      {/* Default meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#1976d2" />
      
      {/* Default title and description */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Default Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={`${siteUrl}/images/keyboard-dojo-og.jpg`} />
      <meta property="og:site_name" content="Keyboard Dojo" />
      
      {/* Default Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={`${siteUrl}/images/keyboard-dojo-og.jpg`} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
    </Helmet>
  );
};

export default DefaultSEO; 