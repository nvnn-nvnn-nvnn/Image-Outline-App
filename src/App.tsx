// React
import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { Toolbar } from '@mui/material' // Add this import

// Components
import Header from './components/Layout/givingHead'
import Footer from './components/Layout/footFetish'

// Images from Assets (import so Vite bundles them)
import kirk from './assets/cute-lady.jpg';
import fixedkirk from './assets/cute-lady-outline.png';
const kanye = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800';
import fixedkanye from './assets/example-guy-outlined.png';
import monero from './assets/primary-monero-qr.png';
import monerosvg from './assets/monero.svg';

import outlinerperson1 from './assets/outline-person-1.png';


// Authentication

import { useAuth } from './contexts/authContexts';

// Themes
import ImageUpload from './components/Layout/ImageUpload'
import { Flex, Text, Button as RadixButton } from "@radix-ui/themes";
import { Theme } from "@radix-ui/themes";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// Native CSS
import './App.css'

// APP Bar components
import AppAppBar from './components/AppAppBar/AppAppBar'
import Square from './components/Layout/uploadSquare'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// Page Context + State for AppBar
import { PageContext } from './contexts/pageContexts'




function App() {
  // const { currentPage } = useContext(PageContext);
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const { user, signInWithGoogle, logout } = useAuth();

  // Captcha handling functions
  useEffect(() => {
    // Add global captcha error handler
    (window as any).onError = () => {
      console.error('hCaptcha error occurred');
      alert('Captcha error occurred. Please refresh the page and try again.');
    };

    // Add form submission handler
    const handleFormSubmit = async (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Get captcha response
      const captchaResponse = (window as any).hcaptcha?.getResponse();
      
      if (!captchaResponse) {
        alert('Please complete the captcha verification.');
        return;
      }

      // Add captcha response to form data
      formData.append('h-captcha-response', captchaResponse);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('Message sent successfully!');
          form.reset();
          (window as any).hcaptcha?.reset();
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Failed to send message. Please try again.');
      }
    };

    // Attach form handler when contact form is available
    const contactForm = document.getElementById('contactform');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Cleanup
    return () => {
      const contactForm = document.getElementById('contactform');
      if (contactForm) {
        contactForm.removeEventListener('submit', handleFormSubmit);
      }
    };
  }, [currentPage]);

  return (
    <Theme appearance="dark" style={{ backgroundColor: '#0d1421', minHeight: '100vh' }}>
      <AppAppBar />
      <Toolbar /> {/* Space for fixed AppBar */}
       
     
      {/* Show sign in if not authenticated */}
      {!user && currentPage === 'App' && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: '40px' 
        }}>
          <Box sx={{
            maxWidth: '500px',
            width: '100%',
            padding: '60px 40px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '20px',
              color: '#e8eaed'
            }}>
              Sign in to use Strokify
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Create up to 3 stunning stroked images per day, completely free!
            </p>
                     <p style={{
              fontSize: '1 rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
             You need to sign up to stroke it!
            </p>
            <Button 
              onClick={signInWithGoogle} 
              sx={{ 
                width: '100%',
                maxWidth: '300px',
                height: '50px',
                border: 'solid 1px #fff',
                fontSize: '1rem',
                '&:hover': {
                  boxShadow: '0 0 10px #4a90e2, 0 0 20px #4a90e2',
                  border: 'solid 1px #fff'
                }
              }}
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>
      )}
            

      {/* Show app content if authenticated */}
    {user && currentPage === 'App' && (
      <div className="app-page">
        <Box sx={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '1.2rem' }}>Welcome, {user.displayName}!</p>
            <Button 
              onClick={logout}
              sx={{
                border: 'solid 1px #fff',
                '&:hover': {
                  boxShadow: '0 0 10px #4a90e2',
                  border: 'solid 1px #fff'
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
          <Square />
           
        </Box>
      </div>
    )}
      
      <main style={{ padding: "20px" }}>

      {/* Showcase - default index page mostlikely */}

      {currentPage == 'index' && (
        <div className='index-page'>
          <div className='index-headers'>
            <h1>
              Welcome to Strokify!
            </h1>
            <h2>
              Create outline strokes for your images efficiently and effectively
            </h2>
             <Box>
                <Button  
                  onClick={() => setCurrentPage('App')}
                  sx={{ 
                    width: '200px', 
                    height: '50px',
                    border: "solid 1px #fff",
                    justifyContent: "center",
                    alignItems: "center",
                    '&:hover': {
                      boxShadow: '0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 40px #4a90e2',
                      border: 'solid 1px #fff'
                    }
                  }}>
                    Try out the App!
                </Button>
            
             </Box>
              <h3>
                Let's stroke it together!
              </h3>
          </div>
       
          <div className='index-gal-title'>
            <h1>Examples of what the app can accomplish:</h1>
          </div>
          <div className='index-gallery'>

            {/* Before */}
            <img src={kirk} alt="" style={{width: '350px'}}/>
            {/* After */}
            <img src={fixedkirk} alt="" style={{width: '350px'}}/>
            {/* Before */}
            <img src={kanye} alt="" style={{width: '350px'}}/>
            {/* After */}
            <img src={fixedkanye} alt="" style={{width: '350px'}}/>

      
          </div>    

          <div className='index-extras'>
              <h3>
                Like to share what you've made with the app? Send it to us to see!
              </h3>

              <Box>
                <Button onClick={() => setCurrentPage('contact')}
                  sx={{
                    width: '200px', 
                    height: '50px',
                    border: "solid 1px #fff",
                    justifyContent: "center",
                    alignItems: "center",
                    '&:hover': {
                      boxShadow: '0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 40px #4a90e2',
                      border: 'solid 1px #fff'
                    }
                  }}>
                  Share with us!
                </Button>
              </Box>
          </div>

          <section className='index-section-1'>

          </section>
        </div>

      )}  




        {/* Home Page */}
        {currentPage === 'App' && (
          <div className='app-page'>
            {/* <Square /> */}
          </div>
        )}
        
        {/* Features Page */}
        {currentPage === 'features' && (
          <div className="features-page">
            <h1>
              Features
            </h1>
            <h2>
              Welcome to Strokify!
            </h2>
            <p>
              With Strokify, just upload an image, remove the background, adjust the outline stroke, and your object instantly gets a sleek, professional stroke! Stroke it till you finish!
            </p>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              margin: '40px 0' 
            }}>
              <iframe 
                width="600" 
                height="338" 
                src="https://www.youtube.com/watch?v=xvFZjo5PgG0" 
                title="How to use Strokify"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            </Box>


            
              <div className="faq-section">
                <h2>Quick Q&A</h2>
                <p><strong>Q: How many images can I create per day?</strong></p>
                <p>A: You can create up to 3 images per day for free!</p>
                
                <p><strong>Q: What kind of images can Strokify use?</strong></p>
                <p>A: So far, Strokify can only operate on PNG, JPG, and IMG images formats</p>

                <p><strong>Q: Do I need to sign in?</strong></p>
                <p>A: Yes, sign in with Google to start using Strokify.</p>
              </div>

              <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
                <Button 
                  onClick={() => setCurrentPage('about')}
                  sx={{ 
                    width: '200px', 
                    height: '50px',
                    border: "solid 1px #fff",
                    '&:hover': {
                      boxShadow: '0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 40px #4a90e2',
                      border: 'solid 1px #fff'
                    }
                  }}
                >
                  Learn More About Us
                </Button>
              </Box>
            

          </div>

          
        )}
                
        {/* Terms Page */}
        {currentPage === 'terms' && (
        <div className='terms-page'>
          <h1>Terms and Conditions for Strokify</h1>

          <div className='terms-mat'>
            <div className='terms-list'>
              <ol>
                <li>
                  <h2>Acceptance of Terms</h2>
                  <p>By accessing or using Strokify, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the App.</p>
                </li>

                <li>
                  <h2>Description of Service</h2>
                  <p>Strokify provides an image editing service that allows users to:</p>
                  <ul>
                    <li>Upload images</li>
                    <li>Remove image backgrounds automatically</li>
                    <li>Apply customizable strokes to images</li>
                    <li>Download edited images for free</li>
                  </ul>
                </li>

                <li>
                  <h2>User Accounts and Eligibility</h2>
                  <ul>
                    <li>You must be at least 13 years of age to use this App</li>
                    <li>You are responsible for maintaining the confidentiality of any account credentials</li>
                    <li>You agree to provide accurate and complete information when using the App</li>
                  </ul>
                </li>

                <li>
                  <h2>User Content and Uploads</h2>

                  <h3>4.1 Your Responsibilities</h3>
                  <ul>
                    <li>You retain all ownership rights to images you upload</li>
                    <li>You are solely responsible for the content you upload</li>
                    <li>You represent and warrant that you have all necessary rights to upload and edit the images you submit</li>
                  </ul>

                  <h3>4.2 Prohibited Content</h3>
                  <p>You may not upload images that:</p>
                  <ul>
                    <li>Infringe upon intellectual property rights of others</li>
                    <li>Contain illegal, harmful, or offensive content</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Contain malware, viruses, or malicious code</li>
                    <li>Depict minors in inappropriate contexts</li>
                  </ul>

                  <h3>4.3 Content Storage and Privacy</h3>
                  <ul>
                    <li>Uploaded images are processed for background removal and stroke application</li>
                    <li>We do not claim ownership of your uploaded content</li>
                    <li>Images may be temporarily stored for processing purposes</li>
                    <li>We reserve the right to remove any content that violates these terms</li>
                  </ul>
                </li>

                <li>
                  <h2>Intellectual Property Rights</h2>

                  <h3>5.1 Your Content</h3>
                  <p>You retain all rights to images you upload and edit through the App.</p>

                  <h3>5.2 Our Property</h3>
                  <p>The App, including its design, functionality, software, algorithms, and all related intellectual property, is owned by Strokify and is protected by copyright, trademark, and other laws.</p>

                  <h3>5.3 License to Use the App</h3>
                  <p>We grant you a limited, non-exclusive, non-transferable license to use the App for personal or commercial purposes, subject to these Terms.</p>
                </li>

                <li>
                  <h2>Acceptable Use Policy</h2>
                  <p>You agree NOT to:</p>
                  <ul>
                    <li>Use the App for any illegal purpose</li>
                    <li>Attempt to gain unauthorized access to the App or its systems</li>
                    <li>Interfere with or disrupt the App's functionality</li>
                    <li>Use automated systems (bots, scrapers) without permission</li>
                    <li>Reverse engineer, decompile, or disassemble the App</li>
                    <li>Remove or alter any copyright notices or branding</li>
                  </ul>
                </li>

                <li>
                  <h2>Disclaimer of Warranties</h2>
                  <p>THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
                  <ul>
                    <li>Warranties of merchantability or fitness for a particular purpose</li>
                    <li>Warranties that the App will be uninterrupted, error-free, or secure</li>
                    <li>Warranties regarding the accuracy or quality of background removal or stroke application</li>
                  </ul>
                </li>

                <li>
                  <h2>Limitation of Liability</h2>
                  <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                  <ul>
                    <li>Strokify shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Our total liability shall not exceed $100 or the amount you paid to use the App (whichever is greater)</li>
                    <li>We are not responsible for any loss of data, images, or content</li>
                  </ul>
                </li>

                <li>
                  <h2>Indemnification</h2>
                  <p>You agree to indemnify and hold harmless Strokify, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
                  <ul>
                    <li>Your use of the App</li>
                    <li>Your uploaded content</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party rights</li>
                  </ul>
                </li>

                <li>
                  <h2>Third-Party Services</h2>
                  <p>The App may integrate with or link to third-party services. We are not responsible for the content, privacy practices, or terms of any third-party services.</p>
                </li>

                <li>
                  <h2>Privacy and Data Collection</h2>
                  <p>Your use of the App is also governed by our Privacy Policy. By using the App, you consent to our collection and use of data as described in the Privacy Policy.</p>
                </li>

                <li>
                  <h2>Modifications to the Service</h2>
                  <p>We reserve the right to:</p>
                  <ul>
                    <li>Modify, suspend, or discontinue the App at any time</li>
                    <li>Change these Terms at any time (we will notify users of material changes)</li>
                    <li>Update features, functionality, or pricing</li>
                  </ul>
                </li>

                <li>
                  <h2>Termination</h2>
                  <p>We may terminate or suspend your access to the App immediately, without notice, for:</p>
                  <ul>
                    <li>Violation of these Terms</li>
                    <li>Illegal activity</li>
                    <li>Abusive behavior</li>
                    <li>Any reason at our sole discretion</li>
                  </ul>
                </li>

                <li>
                  <h2>Copyright Infringement</h2>
                  <p>If you believe content on the App infringes your copyright, please contact us at [insert email] with:</p>
                  <ul>
                    <li>Your contact information</li>
                    <li>Description of the copyrighted work</li>
                    <li>Description of the infringing material and its location</li>
                    <li>A statement of good faith belief</li>
                    <li>A statement under penalty of perjury that the information is accurate</li>
                  </ul>
                </li>

                <li>
                  <h2>Governing Law and Dispute Resolution</h2>
                  <p>These Terms shall be governed by the laws of [Insert Jurisdiction], without regard to conflict of law principles. Any disputes shall be resolved through [arbitration/courts in specified jurisdiction].</p>
                </li>

                <li>
                  <h2>Severability</h2>
                  <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full effect.</p>
                </li>

                <li>
                  <h2>Entire Agreement</h2>
                  <p>These Terms constitute the entire agreement between you and Strokify regarding the use of the App.</p>
                </li>

                <li>
                  <h2>Contact Information</h2>
                  <p>For questions about these Terms, please contact us at:</p>
                  <ul>
                    <li>Email: Strokifybusiness@proton.me</li>
              
                  </ul>
                </li>

                <li>
                  <h2>Export Control</h2>
                  <p>You agree to comply with all applicable export and import laws and regulations in your use of the App.</p>
                </li>

                <li>
                  <h2>No Waiver</h2>
                  <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                </li>
              </ol>

              <Box sx={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
                <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>
                  By using Strokify, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
                <p style={{ fontSize: '14px', color: '#888' }}>
                  Last Updated: 11/06/2025
                </p>
              </Box>
            </div>
          </div>
        </div>
      )}
        
        {/* Highlights Page */}
        {currentPage === 'highlights' && (
          <div className='highlights-page'>
            <h1>Highlights</h1>
            <h2>Check out stroked images others have created!</h2>
              <div className='highlights-gallery'>
                  <img src={fixedkirk} alt="" style={{width: '350px'}}/>
                  
                  <img src={fixedkanye} alt="" style={{width: '350px'}}/>

                    
                  <img src={outlinerperson1} alt="" style={{width: '350px'}}/>
                  


              </div>

              <div className='index-extras'>
              <h3>
                Like to share what you've made with the app? Send it to us to see!
              </h3>
              
             
            <Button onClick={() => setCurrentPage('contact')}
              sx={{
                width: '200px', 
                height: '50px',
                border: 'solid 1px #fff',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                  boxShadow: '0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 40px #4a90e2',
                  border: 'solid 1px #fff'
                }
              }}>
              Share with us!
            </Button>
          </div>
          </div>
        )}
        
        {/* About Page */}
        {currentPage === 'about' && (
        <div className='about-page'>
          <h1>About Us</h1>

          <section className='about-intro'>
            <h2>The Problem</h2>
            <p>
              Ever tried adding a stroke outline to an object in a photo?
              It's either accomplished only by using expensive software or by using sketchy online tools that produce mediocre results.
            </p>
          </section>

          <section className='about-solution'>
            <h2>Our Solution</h2>
            <p className='highlight-text'>
              Strokify solves this. It's a Fast, accurate, and completely free option.
            </p>
            <p>
              We provide an accurate, efficient, and quick way to customize photos and apply strokes to objects in images—without the need for advanced image alteration and graphic design software.
            </p>
          </section>

          <section className='about-impact'>
            <h2>Why It Matters</h2>
            <p>
              Applying a stroke to an image's object can emphasize and focus on its appearance, giving it direct attraction for viewers.
            </p>
            <p>
              From content creators needing stroked objects for thumbnails, to legitimate companies needing materials for their own projects—Strokify is the solution.
            </p>
          </section>

          
          <section className='about-impact'>
            <h2>How long have we been in Business?</h2>
            <p>
             Strokify was coded and developed by Devan Lee in November, 2025. We've been Strokin' it since!
            </p>
          </section>

          <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
            <Button 
              onClick={() => setCurrentPage('App')}
              sx={{ 
                width: '200px', 
                height: '50px',
                border: "solid 1px #fff",
                '&:hover': {
                  boxShadow: '0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 40px #4a90e2',
                  border: 'solid 1px #fff'
                }
              }}
            >
              Try Strokify Now
            </Button>
          </Box>
        </div>
      )}





        {/* Blog Page */}
        {currentPage === 'blog' && (
          <div className='blog-page'>
            <h1>Blog</h1>

            <section className='blog-section'>
              <div className='blog-container'
              onClick={() => setCurrentPage('blog-post-1')}
              >
                <div className="blog-box">
                  <div className="blog-content">
                    <h1>How to use Strokify</h1>
                    <h2>Devan L</h2>
                    <img src={fixedkirk} alt="Strokify example" />
                    <p>A guide detailing how to use Strokify effectively and efficiently.</p>
                  </div>
                </div>

             
              </div>
            </section>
          </div>
        )}

        {/* Support Page */}
      {currentPage === 'support' && (
        <div className='support-page'>
          <h1>Support</h1>
          <section className='support-section'>
            <div className="support-card">
              <div className='support-header'>
                <h2>If you would like to support our project - we would greatly appreciate it!</h2>
              </div>
              
              <div className="support-content">
                <div className="donation-info">
                  <img src={monero} alt="Monero logo" className="monero-logo" />
                  <div className="donation-text">
                    <img src={monerosvg} alt="" />
                    <h3>We accept Monero donations!</h3>
                    <p>Your support helps us continue improving the app and adding new features.</p>
                  </div>
                </div>
                
                <div className="donation-address">
                  <div className="address-box">
                    <span className="address-label">Monero Address:</span>
                    <a 
                      href="monero:43pqJ6SRAD18W3NFMeEVcR12pXSYou32qJQT59S9LrJrbzeQGZjTihs2MahzqaCanXgtZRKG5tMC1Hk9ymvPvB6qQze3rqS"
                      className="crypto-address"
                      style={{ textDecoration: 'none', color: '#68d391' }}
                      title="Click to open in Monero wallet"
                    >
                      43pqJ6SRAD18W3NFMeEVcR12pXSYou32qJQT59S9LrJrbzeQGZjTihs2MahzqaCanXgtZRKG5tMC1Hk9ymvPvB6qQze3rqS
                    </a>
                    <button 
                      className="copy-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        const address = '43pqJ6SRAD18W3NFMeEVcR12pXSYou32qJQT59S9LrJrbzeQGZjTihs2MahzqaCanXgtZRKG5tMC1Hk9ymvPvB6qQze3rqS';
                        navigator.clipboard.writeText(address).then(() => {
                          const btn = e.target as HTMLButtonElement;
                          const originalText = btn.textContent;
                          btn.textContent = 'Copied!';
                          btn.style.background = '#48bb78';
                          setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.background = '#4299e1';
                          }, 2000);
                        }).catch(err => {
                          console.error('Failed to copy:', err);
                          alert('Failed to copy address. Please copy manually.');
                        });
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

        {/* privacy */}
        {currentPage === 'privacy' && (
      <div className='privacy-page'>
        <h1>Privacy Policy for Strokify</h1>

        <div className='privacy-mat'>
          <div className='privacy-list'>
            <ol>
              <li>
                <h2>Introduction</h2>
                <p>Welcome to Strokify. We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your information. This Privacy Policy explains how Strokify ("we," "us," or "our") handles your data when you use our image outline stroke creation service. By using Strokify, you agree to the terms outlined in this policy.</p>
              </li>

              <li>
                <h2>Information We Collect</h2>
                <h3>2.1 Personal Information</h3>
                <p>When you sign in to Strokify using Google Authentication, we collect basic account information including your name, email address, and Google profile picture. This information is used solely for account creation, authentication, and to track your daily usage limit of 3 images per day.</p>
                
                <h3>2.2 Usage Data</h3>
                <p>We automatically collect information about your interactions with Strokify, including the number of images processed, timestamps of usage, and technical data such as your IP address, browser type, and device information. This data helps us monitor usage limits, prevent abuse, and improve our service.</p>
                
                <h3>2.3 Image Data</h3>
                <p>Images you upload to Strokify are processed through our background removal API and stroke application system. We temporarily store your images during processing but do not retain them permanently on our servers. Processed images are automatically deleted after download or within 24 hours, whichever comes first.</p>
              </li>

              <li>
                <h2>How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ul>
                  <li>To authenticate your identity and manage your account through Google Sign-In</li>
                  <li>To enforce the 3 images per day usage limit and prevent spam or abuse</li>
                  <li>To process your images using our background removal and stroke application services</li>
                  <li>To deliver advertisements that support our free service model</li>
                  <li>To improve our service, troubleshoot issues, and analyze usage patterns</li>
                  <li>To communicate important updates about service changes or policy modifications</li>
                </ul>
              </li>

              <li>
                <h2>Data Storage and Security</h2>
                <p>We take reasonable measures to protect your data from unauthorized access, alteration, or destruction:</p>
                <ul>
                  <li>User authentication data is securely managed through Firebase Authentication with industry-standard encryption</li>
                  <li>Usage data and account information are stored in secure Firebase Firestore databases with access controls</li>
                  <li>Uploaded images are transmitted over encrypted HTTPS connections and are temporarily stored only during processing</li>
                  <li>We implement rate limiting and authentication requirements to prevent unauthorized access to our API services</li>
                  <li>While we strive to protect your data, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security</li>
                </ul>
              </li>

              <li>
                <h2>Data Sharing and Disclosure</h2>
                <h3>5.1 Third-Party Services</h3>
                <p>Strokify uses the following third-party services that may collect or process your data: Google Firebase (for authentication and database services), background removal API services (for image processing), and advertising networks (Google AdSense or similar) to display ads. These third parties have their own privacy policies governing their use of your information.</p>
                
                <h3>5.2 Legal Requirements</h3>
                <p>We may disclose your information if required to do so by law, court order, or government regulation, or if we believe such action is necessary to comply with legal obligations, protect our rights or property, prevent fraud, or ensure the safety of our users.</p>
              </li>

              <li>
                <h2>Your Rights and Choices</h2>
                <p>You have the following rights regarding your personal data:</p>
                <ul>
                  <li>Access: You can request a copy of the personal information we hold about you</li>
                  <li>Deletion: You can request deletion of your account and associated data at any time by contacting us</li>
                  <li>Opt-out: While ads are required to use our free service, you can choose to stop using Strokify at any time</li>
                  <li>Data Portability: You can download any images you've processed before they are automatically deleted</li>
                  <li>Correction: You can update your Google account information directly through your Google account settings</li>
                </ul>
              </li>

              <li>
                <h2>Cookies and Tracking Technologies</h2>
                <p>Strokify uses cookies and similar tracking technologies to maintain your login session, remember your preferences, enforce usage limits, and deliver relevant advertisements. Our advertising partners may also use cookies to serve targeted ads. You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of Strokify.</p>
              </li>

              <li>
                <h2>Children's Privacy</h2>
                <p>Strokify is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will delete such information from our systems.</p>
              </li>

              <li>
                <h2>International Data Transfers</h2>
                <p>Your information may be transferred to and processed in countries other than your own, including the United States, where our servers and service providers are located. These countries may have different data protection laws than your jurisdiction. By using Strokify, you consent to the transfer of your information to these countries.</p>
              </li>

              <li>
                <h2>Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the "Last Updated" date at the bottom of this policy and may notify you through the app or via email. Your continued use of Strokify after changes are posted constitutes your acceptance of the updated policy.</p>
              </li>

              <li>
                <h2>Contact Us</h2>
                <p>If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:</p>
                <ul>
                  <li>Email: Strokifybusiness@proton.me</li>
                </ul>
              </li>
            </ol>

            <Box sx={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>
                By using Strokify, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <p style={{ fontSize: '14px', color: '#888' }}>
                Last Updated: 11/06/2025
              </p>
            </Box>
          </div>
        </div>
      </div>
    )}

        
        {/* tos */}
        {currentPage === 'tos' && (
          <div className='tos-page'>
            <h1>TERMS OF SERVICE</h1>
          </div>
        )}
        {/* Blog Post 1 */}
        {currentPage === 'blog-post-1' && (
          <div className='blog-post-page'>
            <div className='blog-post-container'>
              <Button 
                onClick={() => setCurrentPage('blog')}
                sx={{ 
                  marginBottom: '20px',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                ← Back to Blog
              </Button>
              
              <h1>How to use Strokify</h1>
              <h2>By Devan L</h2>
              
              <div className='blog-post-content'>
                <p>Turn your images from ordinary to extraordinary—Strokify makes highlighting your objects effortless!</p>
                
                <h3>Introduction</h3>
                <p></p>
                
                <h3>Getting Started</h3>
                <p>Placeholder getting started text...</p>
                
                <h3>Step-by-Step Guide</h3>
                <p>Placeholder step-by-step guide text...</p>
                
                <h3>Tips and Tricks</h3>
                <p>Placeholder tips and tricks text...</p>
                
                <h3>Conclusion</h3>
                <p>Placeholder conclusion text...</p>
              </div>
            </div>
          </div>
        )}
        {/* contact */}
      {currentPage === 'contact' && (
      <div className='contact-page'>
        <h1>Contact</h1>
        <p className='contact-subtitle'>Let us know how we can help and we will follow up shortly.</p>
        <section className="contact">
          <div className="contact-contain">
           
            <form action="https://api.web3forms.com/submit" method="POST" className="contact-form" id="contactform">
              <input type="hidden" name="access_key" value="c58af28d-4a41-436a-a49b-77a99b88010b" />
              
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="Name" placeholder="Your Name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="Email" placeholder="Your Email" required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="tel" name="Phone" placeholder="Your Phone" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" placeholder="Your Message" required></textarea>
              </div>

              
              <div className="h-captcha" data-sitekey="YOUR_HCAPTCHA_SITE_KEY_HERE" data-theme="dark" data-error-callback="onError"></div>
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
              
              <button type="submit" className="contact-submit">Send Message</button>
            </form>
          </div>
        </section>
      </div>
    )}
      </main>
      
      <Footer /> 
    </Theme>
  );
}

export default App