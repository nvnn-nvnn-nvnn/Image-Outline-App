// components/ImageUploadSquare.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/authContexts'; // ← ADD THIS

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
  padding: theme.spacing(4),
  color: '#fff',
  border: `2px dashed ${theme.palette.grey[400]}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  transition: '0.5s',
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

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
};

// Add stroke around transparent edges
const addStrokeToImage = (
  imageData: string,
  strokeWidth = 3,
  strokeColor = '#FFFFFF'
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(imageData);

      const padding = strokeWidth;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      ctx.drawImage(img, padding, padding, img.width, img.height);
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      const strokeRgb = hexToRgb(strokeColor);
      const strokeMask = new Array(canvas.width * canvas.height).fill(false);

      // First pass: detect edges
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];
          if (alpha < 128) {
            for (let dy = -strokeWidth; dy <= strokeWidth; dy++) {
              for (let dx = -strokeWidth; dx <= strokeWidth; dx++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > strokeWidth) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
                  const nIdx = (ny * canvas.width + nx) * 4;
                  if (data[nIdx + 3] > 0) {
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

      // Second pass: apply stroke
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          if (strokeMask[y * canvas.width + x]) {
            data[index] = strokeRgb.r;
            data[index + 1] = strokeRgb.g;
            data[index + 2] = strokeRgb.b;
            data[index + 3] = 255;
          }
        }
      }

      ctx.putImageData(imageDataObj, 0, 0);
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
  const [freeTriesLeft, setFreeTriesLeft] = useState<number | null>(3);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { user } = useAuth();

  // Fetch initial usage count when user signs in
  useEffect(() => {
    const fetchUsageCount = async () => {
      if (!user) {
        setFreeTriesLeft(3); // Default for non-authenticated
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/usage-status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => null);

        if (response && response.ok) {
          const data = await response.json();
          setFreeTriesLeft(data.remaining ?? 3);
        } else {
          // Fallback: assume 3 if endpoint doesn't exist yet
          setFreeTriesLeft(3);
        }
      } catch (err) {
        console.error('Failed to fetch usage count:', err);
        setFreeTriesLeft(3);
      }
    };

    fetchUsageCount();
  }, [user]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileSelect called', event);
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    if (file && file.type.startsWith('image/')) {
      console.log('File is valid image, reading...');
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('FileReader onload triggered');
        if (typeof e.target?.result === 'string') {
          console.log('Setting selected image');
          setSelectedImage(e.target.result);
          setProcessedImage(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log('File is not valid or not an image');
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
        if (typeof e.target?.result === 'string') {
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

    // Check if user is logged in
    if (!user) {
      alert('Please log in to use this feature');
      window.location.href = '/login'; // Adjust to your login route
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Get Firebase ID token
      const token = await user.getIdToken();
      
      const payload = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ← Firebase token
        },
        body: JSON.stringify({ imageData: selectedImage }),
      };

      // Try multiple API endpoints in order
      console.log('[removeBackground] attempting API call...');
      let response = null;
      
      // 1. Try localhost first (for development)
      try {
        console.log('[removeBackground] trying localhost...');
        response = await fetch('http://localhost:3000/api/remove-background', payload);
        if (response && response.ok) {
          console.log('[removeBackground] localhost success');
        } else {
          response = null;
        }
      } catch (error: unknown) {
        console.log('[removeBackground] localhost failed:', (error as Error).message);
        response = null;
      }

      // 2. Try Vercel deployment if localhost failed
      if (!response) {
        try {
          const vercelUrl = 'https://image-outline-8u1dr7y88-vdddvdddvddds-projects.vercel.app/api/remove-background';
          console.log('[removeBackground] trying Vercel:', vercelUrl);
          response = await fetch(vercelUrl, payload);
          if (response && response.ok) {
            console.log('[removeBackground] Vercel success');
          } else {
            response = null;
          }
        } catch (e: any) {
          console.log('[removeBackground] Vercel failed:', e.message);
          response = null;
        }
      }

      // 3. Try environment variable URL as fallback
      if (!response) {
        const API_BASE = (import.meta as any).env.VITE_API_URL;
        if (API_BASE) {
          try {
            const envUrl = `${API_BASE}/api/remove-background`;
            console.log('[removeBackground] trying env URL:', envUrl);
            response = await fetch(envUrl, payload);
          } catch (e: any) {
            console.log('[removeBackground] env URL failed:', e.message);
          }
        }
      }

      if (!response) throw new Error('API not reachable');

      const contentType = response.headers.get('content-type') || '';
      const result = contentType.includes('application/json')
        ? await response.json()
        : { error: await response.text() };

      console.log('[removeBackground] response status:', response.status, 'body:', result);

      // Handle authentication errors
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }

      // Handle backend free limit
      if (!response.ok) {
        if (response.status === 403 && result.remaining === 0) {
          setShowUpgrade(true);
          return;
        }
        const details = result.details ? `\nDetails: ${String(result.details).slice(0, 400)}` : '';
        throw new Error((result.error || 'Failed to process image') + details);
      }

      if (result.success) {
        setProcessedImageWithoutStroke(result.processedImage);
        setFreeTriesLeft(result.remaining ?? null);

        if (strokeEnabled) {
          const imageWithStroke = await addStrokeToImage(result.processedImage, strokeWidth, strokeColor);
          setProcessedImage(imageWithStroke);
        } else {
          setProcessedImage(result.processedImage);
        }
      }
    } catch (err: any) {
      console.error('Background removal error:', err);
      setError(err.message);
      alert(`Failed to remove background: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

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
    // Don't reset freeTriesLeft - keep the current count
  };

  return (
    <>
      <SquareContainer onDrop={handleDrop} onDragOver={handleDragOver}>
        {processing ? (
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
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            {showStrokeControls && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  border: '5px solid #3a3f4b',
                  borderRadius: 2,
                  backgroundColor: '#1e1e4a',
                  maxWidth: '500px',
                  mx: 'auto',
                  color: '#fff',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 0 }}>
                    Outline Stroke Settings
                  </Typography>
                  <Button
                    variant={strokeEnabled ? 'contained' : 'outlined'}
                    size="small"
                    onClick={async () => {
                      const newEnabled = !strokeEnabled;
                      setStrokeEnabled(newEnabled);
                      if (processedImageWithoutStroke) {
                        setProcessedImage(
                          newEnabled
                            ? await addStrokeToImage(processedImageWithoutStroke, strokeWidth, strokeColor)
                            : processedImageWithoutStroke
                        );
                      }
                    }}
                  >
                    {strokeEnabled ? 'Stroke ON' : 'Stroke OFF'}
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
                          const w = parseInt(e.target.value);
                          setStrokeWidth(w);
                          if (processedImageWithoutStroke) {
                            setProcessedImage(await addStrokeToImage(processedImageWithoutStroke, w, strokeColor));
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
                          const c = e.target.value;
                          setStrokeColor(c);
                          if (processedImageWithoutStroke) {
                            setProcessedImage(await addStrokeToImage(processedImageWithoutStroke, strokeWidth, c));
                          }
                        }}
                        style={{
                          width: '50px',
                          height: '40px',
                          border: '2px solid #3a3f4b',
                          borderRadius: '8px',
                          cursor: 'pointer',
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
              style={{ maxWidth: '500px', maxHeight: '300px', borderRadius: '8px' }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button variant="contained" color="success" onClick={handleDownload}>
                Download Image
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Start Over
              </Button>
            </Box>
          </Box>
        ) : selectedImage ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Ready to create Stroke Outline
            </Typography>
            
            {freeTriesLeft !== null && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 1, 
                  mb: 2, 
                  display: 'block',
                  color: freeTriesLeft === 0 ? '#ff6b6b' : '#4ade80',
                  fontWeight: 'bold'
                }}>
                {freeTriesLeft === 0 
                  ? '⚠️ No free tries left today' 
                  : `✨ ${freeTriesLeft} free ${freeTriesLeft === 1 ? 'try' : 'tries'} remaining today`}
              </Typography>
            )}
            
            <img
              src={selectedImage}
              alt="Preview"
              style={{ maxWidth: '500px', maxHeight: '500px', borderRadius: '8px' }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={removeBackground}
                disabled={freeTriesLeft === 0}
              >
                Process Image
              </Button>
              <Button variant="outlined" onClick={() => setSelectedImage(null)}>
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
          <Box sx={{ textAlign: 'center', padding: '10px' }}>
            <CloudUploadIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop Image Here
            </Typography>
            <Typography variant="body2" color="#fff" sx={{ mb: 2 }}>
              or
            </Typography>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Select Image
              <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileSelect} />
            </Button>
          </Box>
        )}
      </SquareContainer>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgrade} onClose={() => setShowUpgrade(false)}>
        <DialogTitle>Free Daily Limit Reached</DialogTitle>
        <DialogContent>
          <Typography>
            You've used all 3 free background removals today.
          </Typography>
          <Typography mt={2}>
            Upgrade to <strong>Pro</strong> for unlimited access!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgrade(false)}>Later</Button>
          <Button variant="contained" color="primary" href="/upgrade" target="_blank">
            Upgrade Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}