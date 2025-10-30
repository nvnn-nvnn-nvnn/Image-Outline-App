import { useState } from 'react'
import ReactLogo from './assets/react.svg?react'
import viteLogo from '/vite.svg'
import Header from './components/Layout/givingHead'
import Footer from './components/Layout/footFetish'
import cross from './assets/cross-falls.jpg'
import ImageUpload from './components/Layout/ImageUpload'
import { Flex, Text, Button as RadixButton } from "@radix-ui/themes";  // Renamed
import { Theme } from "@radix-ui/themes";
import Button from '@mui/material/Button';  // Material UI Button
import './App.css'
import AppAppBar from './components/AppAppBar/AppAppBar'
import Square from './components/Layout/upload'

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function App() {
  const greeting = import.meta.env.VITE_GREETING
  const [count, setCount] = useState(0)

  return (
    <Theme  appearance="dark" style={{ backgroundColor: '#1a1d23', minHeight: '100vh' }}>
       <AppAppBar/>
       <main style={{ paddingTop: '150px', paddingBottom: '40px' }}>
        
        {/* Remove the duplicate Header if AppAppBar already contains it */}
        {/* <Header/> */}
        
        <div>
          <Square>
            <ImageUpload/>
            
          </Square>
           
      
      
          <Button variant="contained">Hello world</Button>
        </div>
          
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </main>
      
      <Footer/> 
    </Theme>
  )
}

export default App