// components/ImageUploadSquare.tsx
import React, { useState, useCallback } from 'react';
import { Paper, Box, Typography, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const SquareContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 1000,
  minHeight: 500,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
  marginTop: '70px',
  padding: theme.spacing(4),  // Use theme spacing (32px default)
  color: '#fff',
  border: `2px dashed ${theme.palette.grey[400]}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  transition: "0.5s"
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 }; // Default to white
};

const addStrokeToImage = (imageData: string, strokeWidth = 3, strokeColor = '#FFFFFF'): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageData);
        return;
      }
      
      // Set canvas size (larger to accommodate stroke)
      const padding = strokeWidth;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      
      // Draw the original image centered
      ctx.drawImage(img, padding, padding, img.width, img.height);
      
      // Get image data
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      
      // Parse stroke color
      const strokeRgb = hexToRgb(strokeColor);
      
      // Create a mask for where to apply stroke
      const strokeMask = new Array(canvas.width * canvas.height).fill(false);
      
      // First pass: identify all edge pixels
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];
          
          // If current pixel is transparent, check if it should have stroke
          if (alpha < 128) {
            const searchRadius = 1;
            // Check pixels within stroke distance
            for (let dy = -strokeWidth; dy <= strokeWidth; dy++) {
              for (let dx = -strokeWidth; dx <= strokeWidth; dx++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > strokeWidth) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
                  const neighborIndex = (ny * canvas.width + nx) * 4;
                  const neighborAlpha = data[neighborIndex + 3];
                  
                  if (neighborAlpha > 0) {
                    strokeMask[y * canvas.width + x] = true;
                    break;
                  }
                }
              }
              if (strokeMask[y * canvas.width + x]) break;
            }
          }
        }
      }
      
      // Second pass: apply stroke to masked pixels
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          
          if (strokeMask[y * canvas.width + x]) {
            // Apply stroke color
            data[index] = strokeRgb.r;
            data[index + 1] = strokeRgb.g;
            data[index + 2] = strokeRgb.b;
            data[index + 3] = 255;
          }
        }
      }
      
      // Apply the modified image data
      ctx.putImageData(imageDataObj, 0, 0);
      
      // Convert to data URL and resolve
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageData;
  });
};

export default function ImageUploadSquare() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processedImageWithoutStroke, setProcessedImageWithoutStroke] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState('#FFFFFF');
  const [showStrokeControls, setShowStrokeControls] = useState(true);
  const [strokeEnabled, setStrokeEnabled] = useState(true);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result && typeof e.target.result === 'string') {
          setSelectedImage(e.target.result);
          setProcessedImage(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `outlined-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result && typeof e.target.result === 'string') {
          setSelectedImage(e.target.result);
          setProcessedImage(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const removeBackground = async () => {
    if (!selectedImage) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      console.log('Sending image to backend for processing...');

      const payload = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: selectedImage }),
      };

      let response = await fetch('/api/remove-background', payload).catch(() => null);

      if (!response || response.status === 404) {
        try {
          response = await fetch('http://localhost:3000/api/remove-background', payload);
        } catch (_) {}
      }

      if (!response) {
        throw new Error('API not reachable. Ensure API is running on :3000');
      }

      const contentType = response.headers.get('content-type') || '';
      const result = contentType.includes('application/json')
        ? await response.json()
        : { error: await response.text() };
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process image');
      }
      
      if (result.success) {
        console.log('Background removed successfully!');
        
        // Store the original processed image without stroke
        setProcessedImageWithoutStroke(result.processedImage);
        
        // Apply stroke only if enabled
        if (strokeEnabled) {
          console.log('Adding white stroke outline...');
          const imageWithStroke = await addStrokeToImage(result.processedImage, strokeWidth, strokeColor);
          setProcessedImage(imageWithStroke);
        } else {
          // Use the image without stroke
          setProcessedImage(result.processedImage);
        }
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
      
    } catch (error: any) {
      console.error('Background removal error:', error);
      setError(error.message);
      alert(`Failed to remove background: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setProcessedImageWithoutStroke(null);
    setProcessing(false);
    setError(null);
    setShowStrokeControls(true);
    setStrokeEnabled(true);
    setStrokeWidth(3);
    setStrokeColor('#FFFFFF');
  };

  return (
    <SquareContainer 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {processing ? (
        // Loading state
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Processing Image...
          </Typography>
          <Typography variant="body2" color="#fff">
            This may take a few seconds
          </Typography>
        </Box>
      ) : processedImage ? (
        // Processed image with controls
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          {showStrokeControls && (
            <Box sx={{ 
              mb: 2, 
              p: 2, 
              border: '5px solid #3a3f4b', 
              borderRadius: 2,
              backgroundColor: '#1e1e4a',
              maxWidth: '500px',
              mx: 'auto',
              color: '#fff'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                  Outline Stroke Settings
                </Typography>
                <Button 
                  variant={strokeEnabled ? "contained" : "outlined"}
                  size="small"
                  onClick={async () => {
                    const newStrokeEnabled = !strokeEnabled;
                    setStrokeEnabled(newStrokeEnabled);
                    
                    if (processedImageWithoutStroke) {
                      if (newStrokeEnabled) {
                        const imageWithStroke = await addStrokeToImage(processedImageWithoutStroke, strokeWidth, strokeColor);
                        setProcessedImage(imageWithStroke);
                      } else {
                        setProcessedImage(processedImageWithoutStroke);
                      }
                    }
                  }}
                >
                  {strokeEnabled ? 'Outline ON' : 'Outline OFF'}
                </Button>
              </Box>

              {strokeEnabled && (
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Width: {strokeWidth}px</Typography>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={strokeWidth}
                      onChange={async (e) => {
                        const newWidth = parseInt(e.target.value);
                        setStrokeWidth(newWidth);
                        if (processedImageWithoutStroke) {
                          const newImage = await addStrokeToImage(processedImageWithoutStroke, newWidth, strokeColor);
                          setProcessedImage(newImage);
                        }
                      }}
                      style={{ width: '120px' }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Color</Typography>
                    <input 
                      type="color" 
                      value={strokeColor}
                      onChange={async (e) => {
                        const newColor = e.target.value;
                        setStrokeColor(newColor);
                        if (processedImageWithoutStroke) {
                          const newImage = await addStrokeToImage(processedImageWithoutStroke, strokeWidth, newColor);
                          setProcessedImage(newImage);
                        }
                      }}
                      style={{ 
                        width: '50px', 
                        height: '40px', 
                        border: '2px solid #3a3f4b', 
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}
          
          <img 
            src={processedImage} 
            alt="Processed" 
            style={{ 
              maxWidth: '500px', 
              maxHeight: '300px',
              borderRadius: '8px'
            }} 
          />
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="success"
              onClick={handleDownload}
            >
              Download Image
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleReset}
            >
              Start Over
            </Button>
          </Box>
        </Box>
      ) : selectedImage ? (
        // Image selected but not processed
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Ready to create Stroke Outline
          </Typography>
          <img 
            src={selectedImage} 
            alt="Preview" 
            style={{ 
              maxWidth: '500px', 
              maxHeight: '500px',
              borderRadius: '8px'
            }} 
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={removeBackground}
            >
              Process Image
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setSelectedImage(null)}
            >
              Choose Different Image
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              Error: {error}
            </Typography>
          )}
        </Box>
      ) : (
        // No image selected
        <Box sx={{ textAlign: 'center' , padding: "10px"}}>
          <CloudUploadIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop Image Here
          </Typography>
          <Typography variant="body2" color="#fff" sx={{ mb: 2 }}>
            or
          </Typography>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Select Image
            <VisuallyHiddenInput 
              type="file" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>
        </Box>
      )}
    </SquareContainer>
  );
}