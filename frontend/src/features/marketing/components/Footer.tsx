import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  Divider,
  Stack,
  Button,
  useTheme 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  // Navigation categories
  const footerLinks = {
    company: [
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Keyboard Shortcuts', href: '/shortcuts' },
      { label: 'Documentation', href: '/docs' },
    ],
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Premium', href: '/pricing' },
      { label: 'Download', href: '/download' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  };

  // Social media links
  const socialLinks = [
    { icon: TwitterIcon, href: 'https://twitter.com/keyboarddojo', label: 'Twitter' },
    { icon: FacebookIcon, href: 'https://facebook.com/keyboarddojo', label: 'Facebook' },
    { icon: InstagramIcon, href: 'https://instagram.com/keyboarddojo', label: 'Instagram' },
    { icon: LinkedInIcon, href: 'https://linkedin.com/company/keyboarddojo', label: 'LinkedIn' },
    { icon: YouTubeIcon, href: 'https://youtube.com/keyboarddojo', label: 'YouTube' },
    { icon: GitHubIcon, href: 'https://github.com/keyboarddojo', label: 'GitHub' },
  ];

  // Render a group of footer links
  const renderLinkGroup = (title: string, links: FooterLink[]) => (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={1}>
        {links.map((link) => (
          <Link
            key={link.label}
            component={link.isExternal ? 'a' : RouterLink}
            to={!link.isExternal ? link.href : undefined}
            href={link.isExternal ? link.href : undefined}
            underline="hover"
            color="text.secondary"
            sx={{ 
              '&:hover': { 
                color: 'primary.main',
              },
              display: 'inline-block'
            }}
          >
            {link.label}
          </Link>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        py: { xs: 6, md: 8 },
        bgcolor: 'grey.50',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <KeyboardIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold">
                Keyboard Dojo
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Master keyboard shortcuts and boost your productivity. Our interactive platform helps 
              you learn and practice shortcuts for your favorite applications.
            </Typography>
            
            {/* Social Media Icons */}
            <Box sx={{ mt: 3 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{ 
                    mr: 1, 
                    color: 'text.secondary',
                    '&:hover': { 
                      color: 'primary.main',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
          
          {/* Footer Link Groups */}
          <Grid item xs={6} sm={3} md={2}>
            {renderLinkGroup('Company', footerLinks.company)}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            {renderLinkGroup('Resources', footerLinks.resources)}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            {renderLinkGroup('Product', footerLinks.product)}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            {renderLinkGroup('Legal', footerLinks.legal)}
          </Grid>
        </Grid>

        {/* Newsletter Signup */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Stay up to date
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subscribe to our newsletter for tips, product updates, and productivity hacks.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/newsletter"
                sx={{ fontWeight: 'bold' }}
              >
                Subscribe to Newsletter
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />
        
        {/* Bottom Footer */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Keyboard Dojo. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack 
              direction="row" 
              spacing={3} 
              sx={{ 
                justifyContent: { xs: 'flex-start', md: 'flex-end' } 
              }}
            >
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.href}
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 