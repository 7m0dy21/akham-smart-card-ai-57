
import React, { useRef, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Camera, Power, PauseCircle, User, SquareUser } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CameraView: React.FC = () => {
  const { language, translations, cameraActive, setCameraActive } = useAppContext();
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [detectionMode, setDetectionMode] = useState<'face' | 'jersey'>('face');
  const [processingFrame, setProcessingFrame] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
  // Handle camera frame processing
  const processVideoFrame = () => {
    if (!cameraActive || !videoRef.current || !canvasRef.current || processingFrame) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Simulate AI processing with visual feedback
      setProcessingFrame(true);
      
      // Draw detection indicators (face or jersey number)
      if (detectionMode === 'face') {
        drawFaceDetectionIndicator(context, canvas.width, canvas.height);
      } else {
        drawJerseyNumberIndicator(context, canvas.width, canvas.height);
      }
      
      setTimeout(() => {
        setProcessingFrame(false);
      }, 100);
    }
    
    requestAnimationFrame(processVideoFrame);
  };
  
  // Simulate drawing face detection indicator
  const drawFaceDetectionIndicator = (
    context: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    // Random position for face detection box (for simulation)
    const x = width * 0.3 + Math.random() * width * 0.2;
    const y = height * 0.2 + Math.random() * height * 0.2;
    const boxWidth = width * 0.2;
    const boxHeight = height * 0.3;
    
    context.strokeStyle = '#FFD700';
    context.lineWidth = 2;
    context.setLineDash([5, 3]);
    context.strokeRect(x, y, boxWidth, boxHeight);
    
    // Draw facial landmarks (simulated)
    context.fillStyle = '#FFD700';
    context.beginPath();
    context.arc(x + boxWidth * 0.3, y + boxHeight * 0.3, 2, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.arc(x + boxWidth * 0.7, y + boxHeight * 0.3, 2, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.arc(x + boxWidth * 0.5, y + boxHeight * 0.7, 2, 0, 2 * Math.PI);
    context.fill();
  };
  
  // Simulate drawing jersey number detection indicator
  const drawJerseyNumberIndicator = (
    context: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    // Position for jersey number detection box (for simulation)
    const x = width * 0.4 + Math.random() * width * 0.05;
    const y = height * 0.5 + Math.random() * height * 0.05;
    const boxWidth = width * 0.2;
    const boxHeight = height * 0.15;
    
    context.strokeStyle = '#00FFFF';
    context.lineWidth = 2;
    context.setLineDash([2, 2]);
    context.strokeRect(x, y, boxWidth, boxHeight);
    
    // Draw number recognition indicator
    context.fillStyle = 'rgba(0, 255, 255, 0.2)';
    context.fillRect(x, y, boxWidth, boxHeight);
    context.font = '12px Arial';
    context.fillStyle = '#FFFFFF';
    context.fillText('#', x + boxWidth * 0.5 - 5, y + boxHeight * 0.5 + 5);
  };
  
  const toggleDetectionMode = () => {
    setDetectionMode(prev => prev === 'face' ? 'jersey' : 'face');
  };
  
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
    setPermissionDenied(false);
    setLoadingCamera(false);
  };
  
  const toggleCamera = async () => {
    if (!cameraActive) {
      try {
        setLoadingCamera(true);
        
        // Use navigator.mediaDevices.getUserMedia with fallback options
        const constraints = { 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        // First try to get camera
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraReady(true);
          setCameraActive(true);
          setPermissionDenied(false);
          
          // Show success toast
          toast({
            title: language === 'ar' ? 'تم تفعيل الكاميرا' : 'Camera Activated',
            description: language === 'ar' 
              ? 'الكاميرا جاهزة للاستخدام' 
              : 'Camera is ready to use',
          });
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        
        // Show user-friendly toast message
        toast({
          title: language === 'ar' ? 'خطأ في الكاميرا' : 'Camera Error',
          description: language === 'ar' 
            ? 'يرجى السماح بالوصول للكاميرا من إعدادات المتصفح' 
            : 'Please allow camera access in your browser settings',
          variant: 'destructive',
        });
        
        setPermissionDenied(true);
        stopCamera();
      } finally {
        setLoadingCamera(false);
      }
    } else {
      stopCamera();
      
      // Show toast when camera is deactivated
      toast({
        title: language === 'ar' ? 'تم إيقاف الكاميرا' : 'Camera Deactivated',
        description: language === 'ar' 
          ? 'تم إيقاف الكاميرا بنجاح' 
          : 'Camera has been turned off',
      });
    }
  };

  // Start processing video frames when camera is active
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        processVideoFrame();
      };
    }
  }, [cameraActive]);

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
        <div className="flex gap-2">
          {cameraActive && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleDetectionMode}
              className="bg-black bg-opacity-20"
            >
              {detectionMode === 'face' ? (
                <>
                  <User className="mr-2" size={16} />
                  {language === 'ar' ? 'الوجه' : 'Face'}
                </>
              ) : (
                <>
                  <SquareUser className="mr-2" size={16} />
                  {language === 'ar' ? 'الرقم' : 'Number'}
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant={cameraActive ? "destructive" : "default"} 
            size="sm"
            onClick={toggleCamera}
            disabled={loadingCamera}
            className={cameraActive ? "bg-referee-red" : ""}
          >
            {loadingCamera ? (
              <div className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                {language === 'ar' ? 'جاري التحميل' : 'Loading...'}
              </div>
            ) : cameraActive ? (
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
      </div>
      
      <div className="relative aspect-video w-full">
        {cameraActive ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
              {detectionMode === 'face' ? 
                (language === 'ar' ? 'وضع التعرف على الوجه' : 'Face Recognition Mode') : 
                (language === 'ar' ? 'وضع التعرف على الرقم' : 'Jersey Number Mode')}
            </div>
            <div className="absolute top-2 left-2 bg-referee-red bg-opacity-70 px-2 py-1 rounded-full pulse-animation">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-referee-blue bg-opacity-30">
            <Camera size={64} className="text-gray-400 opacity-50 mb-4" />
            {permissionDenied ? (
              <div className="text-center px-4 py-2 bg-red-900 bg-opacity-70 rounded-md max-w-xs mx-auto">
                <p className="text-sm text-white">
                  {language === 'ar' 
                    ? 'تم رفض صلاحية الوصول للكاميرا' 
                    : 'Camera permission denied'}
                </p>
                <p className="text-xs mt-1 text-gray-300">
                  {language === 'ar' 
                    ? 'يرجى تمكين الكاميرا من إعدادات المتصفح' 
                    : 'Please enable camera in browser settings'}
                </p>
              </div>
            ) : (
              <div className="text-center px-4">
                <p className="text-sm text-white">
                  {language === 'ar' 
                    ? 'انقر على زر التفعيل لتشغيل الكاميرا' 
                    : 'Click activate button to turn on camera'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;
