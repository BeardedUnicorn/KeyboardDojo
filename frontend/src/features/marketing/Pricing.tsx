import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Switch, 
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { SubscriptionPlan } from '../../api/subscriptionService';
import SEO from '../../components/SEO';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [annualBilling, setAnnualBilling] = useState(true);
  
  // Pricing data
  const plans = [
    {
      name: 'Free',
      description: 'Basic features for individual learning',
      price: 0,
      features: [
        { name: 'Access to basic lessons', included: true },
        { name: 'Track progress on 5 keyboard shortcuts', included: true },
        { name: 'Limited practice exercises', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Advanced shortcut combinations', included: false },
        { name: 'Personalized learning paths', included: false },
        { name: 'Unlimited progress tracking', included: false },
        { name: 'Priority support', included: false },
      ],
      buttonText: 'Get Started',
      buttonAction: () => navigate('/signup'),
      highlight: false
    },
    {
      name: 'Premium',
      description: 'Everything you need to master keyboard shortcuts',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'Unlimited access to all lessons', included: true },
        { name: 'Track progress on unlimited shortcuts', included: true },
        { name: 'Advanced shortcut combinations', included: true },
        { name: 'Personalized learning paths', included: true },
        { name: 'Detailed analytics and insights', included: true },
        { name: 'Export progress reports', included: true },
        { name: 'Priority support', included: true },
      ],
      buttonText: 'Subscribe Now',
      buttonAction: () => navigate('/subscription', { 
        state: { 
          plan: annualBilling ? SubscriptionPlan.ANNUAL : SubscriptionPlan.MONTHLY 
        } 
      }),
      highlight: true,
      savingsPercentage: 16, // Saving percentage when billed annually
    }
  ];

  const handleBillingToggle = () => {
    setAnnualBilling(!annualBilling);
  };

  // Calculate how much is saved with annual billing
  const calculateAnnualSavings = (monthlyPrice: number, annualPrice: number) => {
    return ((monthlyPrice * 12) - annualPrice).toFixed(2);
  };

  // Schema.org structured data for the pricing page
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Keyboard Dojo Premium',
    description: 'Unlock advanced keyboard shortcut lessons and features with Keyboard Dojo Premium subscription plans.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '99.99',
      offerCount: 3,
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Plan',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        },
        {
          '@type': 'Offer',
          name: 'Monthly Premium',
          price: '9.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        },
        {
          '@type': 'Offer',
          name: 'Annual Premium',
          price: '99.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }
      ]
    }
  };

  return (
    <Box>
      <SEO 
        title="Keyboard Dojo Pricing - Free & Premium Plans"
        description="Choose the right Keyboard Dojo plan for your needs. From our free tier to premium subscriptions with advanced features and lessons."
        canonical="/pricing"
        keywords="keyboard dojo pricing, keyboard shortcuts subscription, premium shortcuts, free keyboard shortcuts"
        schema={pricingSchema}
      />
      
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h5" maxWidth="800px">
            Choose the plan that works best for you and start mastering keyboard shortcuts today.
          </Typography>
        </Container>
      </Box>

      {/* Pricing Toggle */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mb: 6
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: annualBilling ? 0.6 : 1,
              fontWeight: annualBilling ? 'normal' : 'bold'
            }}
          >
            Monthly
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={annualBilling}
                onChange={handleBillingToggle}
                color="primary"
              />
            }
            label=""
            sx={{ mx: 2 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: annualBilling ? 1 : 0.6,
                fontWeight: annualBilling ? 'bold' : 'normal'
              }}
            >
              Annual
            </Typography>
            <Chip 
              label="Save 16%" 
              color="success" 
              size="small" 
              sx={{ ml: 1, fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        {/* Pricing Plans */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={plan.highlight ? 8 : 1}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: 2,
                  border: plan.highlight ? '2px solid' : '1px solid',
                  borderColor: plan.highlight ? 'primary.main' : 'divider',
                  overflow: 'hidden',
                  ...(plan.highlight && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'primary.main',
                      width: '150px',
                      height: '40px',
                      transform: 'rotate(45deg) translate(25px, -50px)',
                    }
                  })
                }}
              >
                {plan.highlight && (
                  <Chip 
                    label="RECOMMENDED" 
                    color="primary" 
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      fontWeight: 'bold',
                      letterSpacing: '0.5px'
                    }}
                  />
                )}
                
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {plan.description}
                </Typography>
                
                <Box sx={{ my: 3 }}>
                  {plan.price !== undefined ? (
                    <Typography variant="h3" fontWeight="bold">
                      ${plan.price}
                      <Typography variant="h6" component="span" color="text.secondary">
                        /month
                      </Typography>
                    </Typography>
                  ) : (
                    <Box>
                      <Typography variant="h3" fontWeight="bold">
                        ${annualBilling ? (plan.annualPrice! / 12).toFixed(2) : plan.monthlyPrice}
                        <Typography variant="h6" component="span" color="text.secondary">
                          /month
                        </Typography>
                      </Typography>
                      
                      {annualBilling && (
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          Billed annually (${plan.annualPrice})
                        </Typography>
                      )}
                      
                      {annualBilling && (
                        <Typography variant="body2" color="success.main">
                          Save ${calculateAnnualSavings(plan.monthlyPrice!, plan.annualPrice!)} per year
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Features
                </Typography>
                
                <List disablePadding sx={{ mb: 4, flexGrow: 1 }}>
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} disableGutters disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {feature.included ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="disabled" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature.name} 
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: feature.included ? 'medium' : 'normal',
                            color: feature.included ? 'text.primary' : 'text.secondary',
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  variant={plan.highlight ? "contained" : "outlined"}
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={plan.buttonAction}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1rem',
                    mt: 'auto'
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                question: 'Can I upgrade from Free to Premium later?',
                answer: 'Yes, you can upgrade to Premium at any time. Your progress will be preserved and you\'ll get immediate access to all premium features.'
              },
              {
                question: 'Is there a free trial for Premium?',
                answer: 'Yes, we offer a 7-day free trial for all new Premium subscribers. You can cancel anytime during the trial period without being charged.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) as well as PayPal for Premium subscriptions.'
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your Premium subscription at any time. You\'ll continue to have access to Premium features until the end of your current billing period.'
              },
              {
                question: 'Do you offer refunds?',
                answer: 'If you\'re not satisfied with your Premium subscription, contact us within 14 days of purchase for a full refund. Please note that refunds for annual subscriptions are prorated after the first month.'
              },
              {
                question: 'Are there discounts for education or teams?',
                answer: 'Yes, we offer special pricing for educational institutions and teams. Please contact our sales team at sales@keyboarddojo.com for more information.'
              }
            ].map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} fontSize="small" />
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box textAlign="center" mt={6}>
            <Typography variant="body1" gutterBottom>
              Have more questions about our pricing?
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Money Back Guarantee */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          14-Day Money Back Guarantee
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          We're confident you'll love Keyboard Dojo. If you're not completely satisfied, we offer a 
          hassle-free refund within 14 days of purchase.
        </Typography>
        <Tooltip title="No questions asked refund if requested within 14 days of initial purchase.">
          <Button variant="text" startIcon={<InfoOutlinedIcon />}>
            Refund Policy Details
          </Button>
        </Tooltip>
      </Container>
    </Box>
  );
};

export default Pricing; 