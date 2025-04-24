
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CameraView from '../components/CameraView';
import PlayerRecognition from '../components/PlayerRecognition';

const CardIssuance: React.FC = () => {
  const { language, translations, cameraActive, recognizedPlayer } = useAppContext();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const cardType = location.state?.cardType;

  const handleSubmit = async () => {
    if (!recognizedPlayer) {
      toast({
        title: language === 'ar' ? 'تنبيه' : 'Warning',
        description: language === 'ar' ? 'يرجى التعرف على اللاعب أولاً' : 'Please recognize a player first',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: language === 'ar' ? 'تم إشهار البطاقة' : 'Card Issued',
      description: language === 'ar' ? 'تم تسجيل الحالة بنجاح' : 'Incident recorded successfully',
    });
    
    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-referee-blue to-black text-white">
      <div className="container mx-auto py-6 px-4">
        <Card className="p-6 bg-black bg-opacity-30 border-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {language === 'ar' ? 'إشهار البطاقة والتعرف على اللاعب' : 'Card Issuance & Player Recognition'}
            </h1>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="hover:bg-white/10"
            >
              <ArrowLeft className="mr-2" />
              {language === 'ar' ? 'العودة' : 'Back'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-6">
              <div className="aspect-[4/3] relative">
                <CameraView />
              </div>
              <PlayerRecognition />
            </div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-referee-blue bg-opacity-20">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ar' ? 'تفاصيل البطاقة' : 'Card Details'}
                </h2>
                
                <div className="space-y-4">
                  {recognizedPlayer ? (
                    <div className="flex items-center space-x-4 bg-white/10 p-3 rounded-lg">
                      <div className="h-10 w-10 bg-referee-blue rounded-full flex items-center justify-center">
                        <Camera size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">{recognizedPlayer.name}</p>
                        <p className="text-sm text-gray-300">#{recognizedPlayer.jerseyNumber} - {recognizedPlayer.team}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-300 bg-amber-900/30 p-3 rounded-lg">
                      <AlertTriangle className="mr-2" size={20} />
                      <span>{language === 'ar' ? 'يرجى التعرف على اللاعب أولاً' : 'Please recognize a player first'}</span>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'سبب إشهار البطاقة' : 'Card Issuance Reason'}
                    </label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={language === 'ar' ? 'أدخل سبب إشهار البطاقة...' : 'Enter reason for card issuance...'}
                      className="bg-black bg-opacity-30 text-white resize-none h-32 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                className={`w-full h-12 text-base ${
                  cardType === 'yellow' 
                    ? 'bg-referee-yellow hover:bg-yellow-600 text-black' 
                    : 'bg-referee-red hover:bg-red-700'
                } transition-colors`}
                disabled={!recognizedPlayer || !reason.trim() || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  language === 'ar' ? 'جاري المعالجة...' : 'Processing...'
                ) : (
                  language === 'ar' ? 'إشهار البطاقة' : 'Issue Card'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardIssuance;
