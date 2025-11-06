import { useState } from 'react'
import { useContext } from 'react'
import { Toolbar } from '@mui/material' // Add this import
import ReactLogo from './assets/react.svg?react'
import viteLogo from '/vite.svg'
import Header from './components/Layout/givingHead'
import Footer from './components/Layout/footFetish'
import cross from './assets/cross-falls.jpg'
import ImageUpload from './components/Layout/ImageUpload'
import { Flex, Text, Button as RadixButton } from "@radix-ui/themes";
import { Theme } from "@radix-ui/themes";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import './App.css'
import AppAppBar from './components/AppAppBar/AppAppBar'
import Square from './components/Layout/uploadSquare'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { PageProvider } from './contexts/PageContext';
import { PageContext } from './contexts/pageContexts'




function App() {
  const { currentPage } = useContext(PageContext);

  return (
    <Theme appearance="dark" style={{ backgroundColor: '#0d1421', minHeight: '100vh' }}>
      <AppAppBar />
      <Toolbar /> {/* Space for fixed AppBar */}
      
      
      <main style={{ padding: "40px" }}>

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
                <Button  sx={{ 
                    
                    width: '200px', 
                    height: '50px',
                    border: "solid #fff",
                    justifyContent: "center",
                    alignItems: "center"




                  }}>
                    Try out the App!
                </Button>
            
             </Box>
         
          </div>
       

          <div className='index-gallery'>
            <img src={cross} alt="" style={{width: '250px'}}/>

            <img src={cross} alt="" style={{width: '250px'}}/>

            <img src={cross} alt="" style={{width: '250px'}}/>

            <img src={cross} alt="" style={{width: '250px'}}/>

            <img src={cross} alt="" style={{width: '250px'}}/>

            <img src={cross} alt="" style={{width: '250px'}}/>

            <img src={cross} alt="" style={{width: '250px'}}/>

            <img src={cross} alt="" style={{width: '250px'}}/>
          </div>


          <section className='index-section-1'>

          </section>
        </div>

      )}  




        {/* Home Page */}
        {currentPage === 'App' && (
          <div>
            <Square />
          </div>
        )}
        
        {/* Features Page */}
        {currentPage === 'features' && (
          <div className="features-page">
            <h1>
              Features
            </h1>
            <p>
              Welcome to Strokify!

              To use this app, simply upload picture, remove the background, adjust the outline stroke on the image, and viola! Your image now has a background!
            </p>
          </div>
        )}
                
        {/* Terms Page */}
        {currentPage === 'terms' && (
          <div className='terms-page'>
            <h1>Terms & Conditions</h1>
          </div>
        )}
        
        {/* Highlights Page */}
        {currentPage === 'highlights' && (
          <div className='highlights-page'>
            <h1>Highlights</h1>
          </div>
        )}
        
        {/* About Page */}
        {currentPage === 'about' && (
          <div className='about-page'>
            <h1>About Us</h1>
          </div>
        )}
        
        {/* Blog Page */}
        {currentPage === 'blog' && (
          <div className='blog-page'>
            <h1>Blog</h1>
          </div>
        )}

        {/* Support Page */}

        {currentPage === 'support' && (
          <div className='support-page'>
            <h1>Support</h1>
          </div>
        )}
        {/* privacy */}
        {currentPage === 'privacy' && (
          <div className='privacy-page'>
            <h1>Privacy Policy</h1>
          </div>
        )}
        {/* tos */}
        {currentPage === 'tos' && (
          <div className='tos-page'>
            <h1>TERMS OF SERVICE</h1>
          </div>
        )}
        {/* contact */}
        {currentPage === 'contact' && (
          <div className='contact-page'>
            <h1>Contact</h1>
          </div>
        )}
      </main>
      
      <Footer /> 
    </Theme>
  );
}

export default App