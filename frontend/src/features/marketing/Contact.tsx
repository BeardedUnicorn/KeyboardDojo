import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Alert,
  CircularProgress,
  Divider,
  Link,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import HelpIcon from '@mui/icons-material/Help';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SEO from '../../components/SEO';

const Contact: React.FC = () => {
  // Schema.org structured data for the contact page
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Keyboard Dojo',
    description: 'Get in touch with the Keyboard Dojo team for support, feedback, or partnership opportunities.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Keyboard Dojo',
      email: 'support@keyboarddojo.com',
      url: import.meta.env.VITE_APP_URL || 'https://keyboarddojo.com'
    }
  };

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Here you would normally make an API call to submit the form
        console.log({
          name,
          email,
          subject,
          message,
          inquiryType
        });
        
        // Show success message
        setSubmitSuccess(true);
        
        // Reset form
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setInquiryType('general');
        
      } catch (error: unknown) {
        console.error('Form submission error:', error);
        setSubmitError('There was an error submitting your message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <Box>
      <SEO 
        title="Contact Keyboard Dojo - Get Support & Send Feedback"
        description="Get in touch with the Keyboard Dojo team for support, feedback, or partnership opportunities. We're here to help you master keyboard shortcuts."
        canonical="/contact"
        keywords="contact keyboard dojo, keyboard shortcuts support, feedback, help"
        schema={contactSchema}
      />

      {/* Page Header */}
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
            Contact Us
          </Typography>
          <Typography variant="h5" maxWidth="800px">
            We'd love to hear from you! Reach out with questions, feedback, or support inquiries.
          </Typography>
        </Container>
      </Box>

      {/* Contact Info & Form */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Our team is available to assist you with any questions or concerns you may have 
                about Keyboard Dojo.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <EmailIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Email Us
                    </Typography>
                    <Link href="mailto:support@keyboarddojo.com" color="primary.main">
                      support@keyboarddojo.com
                    </Link>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <PhoneIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Call Us
                    </Typography>
                    <Typography variant="body2">
                      Mon-Fri, 9am-5pm PST
                    </Typography>
                    <Link href="tel:+18005551234" color="primary.main">
                      +1 (800) 555-1234
                    </Link>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <LocationOnIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Visit Us
                    </Typography>
                    <Typography variant="body2">
                      123 Productivity Lane<br />
                      San Francisco, CA 94103<br />
                      United States
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Support Hours
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight="bold">
                    Monday - Friday
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    9:00 AM - 5:00 PM PST
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight="bold">
                    Saturday
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    10:00 AM - 2:00 PM PST
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight="bold">
                    Sunday
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Closed
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Send Us a Message
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Fill out the form below and our team will get back to you as soon as possible.
              </Typography>
              
              {submitSuccess ? (
                <Alert 
                  severity="success"
                  sx={{ mb: 2 }}
                >
                  Thank you for your message! We'll get back to you shortly.
                </Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Inquiry Type
                        </Typography>
                        <RadioGroup
                          row
                          name="inquiry-type"
                          value={inquiryType}
                          onChange={(e) => setInquiryType(e.target.value)}
                        >
                          <FormControlLabel
                            value="general"
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HelpIcon fontSize="small" sx={{ mr: 0.5 }} />
                                General
                              </Box>
                            }
                          />
                          <FormControlLabel
                            value="support"
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SupportAgentIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Support
                              </Box>
                            }
                          />
                          <FormControlLabel
                            value="feedback"
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FeedbackIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Feedback
                              </Box>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        variant="outlined"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        variant="outlined"
                        multiline
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </Grid>
                    
                    {submitError && (
                      <Grid item xs={12}>
                        <Alert severity="error">{submitError}</Alert>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                        sx={{ py: 1.5, px: 4 }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography 
            variant="subtitle1" 
            textAlign="center" 
            color="text.secondary"
            maxWidth={700} 
            mx="auto"
            mb={6}
          >
            Find quick answers to common questions about Keyboard Dojo.
          </Typography>
          
          <Grid container spacing={3}>
            {[
              {
                question: 'How do I reset my password?',
                answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. We\'ll send you an email with instructions to create a new password.'
              },
              {
                question: 'Can I use Keyboard Dojo on multiple devices?',
                answer: 'Yes! Your Keyboard Dojo account can be accessed on any device with a web browser. Your progress will sync automatically across all your devices.'
              },
              {
                question: 'How do I cancel my subscription?',
                answer: 'You can cancel your subscription at any time by going to your account settings and selecting "Manage Subscription". Your premium access will continue until the end of your current billing period.'
              },
              {
                question: 'Are there keyboard shortcuts for applications not listed?',
                answer: 'We regularly add new applications to our shortcut library. If you don\'t see an application you use, please contact us and we\'ll prioritize adding it to our collection.'
              },
              {
                question: 'How can I suggest new features?',
                answer: 'We love hearing from our users! You can suggest new features by selecting the "Feedback" option on our contact form. Our product team reviews all suggestions regularly.'
              },
              {
                question: 'Do you offer team or enterprise plans?',
                answer: 'Yes, we offer special pricing for teams and organizations. Please contact our sales team at sales@keyboarddojo.com for more information about our enterprise solutions.'
              }
            ].map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box textAlign="center" mt={6}>
            <Typography variant="body1" gutterBottom>
              Don't see your question answered here?
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              href="mailto:support@keyboarddojo.com"
            >
              Contact Our Support Team
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact; 