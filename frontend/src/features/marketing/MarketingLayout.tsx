import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import { DefaultSEO } from '../../components/SEO';

const MarketingLayout: React.FC = () => {
  // Organization schema for structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Keyboard Dojo',
    url: import.meta.env.VITE_APP_URL || 'https://keyboarddojo.com',
    logo: `${import.meta.env.VITE_APP_URL || 'https://keyboarddojo.com'}/images/keyboard-dojo-logo.png`,
    sameAs: [
      'https://twitter.com/keyboarddojo',
      'https://facebook.com/keyboarddojo',
      'https://linkedin.com/company/keyboarddojo',
      'https://github.com/keyboarddojo'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-123-4567',
      contactType: 'customer service',
      email: 'support@keyboarddojo.com'
    }
  };

  return (
    <Box>
      <DefaultSEO />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>
      <Header />
      <Box component="main">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MarketingLayout; 