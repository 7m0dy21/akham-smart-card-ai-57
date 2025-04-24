
import React, { useRef, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Camera, Power, PauseCircle } from 'lucide-react';

const CameraView: React.FC = () => {
  const { language, translations, cameraActive, setCameraActive } = useAppContext();
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setCameraActive(false);
  };
  
  const toggleCamera = async () => {
    if (!cameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraReady(true);
          setCameraActive(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        stopCamera();
      }
    } else {
      stopCamera();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-black bg-opacity-30 rounded-xl overflow-hidden">
      <div className="p-4 bg-referee-blue bg-opacity-50 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <Camera className="mr-2" size={20} /> 
          {translations.camera[language]}
        </h2>
        <Button 
          variant={cameraActive ? "destructive" : "default"} 
          size="sm"
          onClick={toggleCamera}
          className={cameraActive ? "bg-referee-red" : ""}
        >
          {cameraActive ? (
            <>
              <PauseCircle className="mr-2" size={16} />
              {translations.deactivate[language]}
            </>
          ) : (
            <>
              <Power className="mr-2" size={16} />
              {translations.activate[language]}
            </>
          )}
        </Button>
      </div>
      
      <div className="camera-container">
        {cameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-referee-blue bg-opacity-30">
            <Camera size={64} className="text-gray-400 opacity-50" />
          </div>
        )}
        
        <div className="camera-overlay">
          {/* Camera UI elements can go here */}
        </div>
      </div>
    </div>
  );
};

export default CameraView;
