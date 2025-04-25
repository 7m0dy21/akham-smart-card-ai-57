
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '@/components/ui/card';
import { Scan, User, ScanFace, Shirt, Loader2 } from 'lucide-react';
import { Player } from '../types';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const PlayerRecognition: React.FC = () => {
  const { 
    language, 
    translations,
    cameraActive,
    match,
    recognizedPlayer,
    setRecognizedPlayer
  } = useAppContext();
  
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [confidence, setConfidence] = useState(0);
  
  // Simulate scan animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isScanning) {
      interval = setInterval(() => {
        setConfidence(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            // Random player recognition
            recognizeRandomPlayer();
            return 0;
          }
          return prev + Math.floor(Math.random() * 10 + 5);
        });
      }, 200);
    } else {
      setConfidence(0);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [isScanning]);

  // Simulate player recognition with scanning animation
  const startScanningProcess = () => {
    if (!cameraActive) {
      toast({
        title: language === 'ar' ? 'تنبيه' : 'Alert',
        description: language === 'ar' ? 'يجب تفعيل الكاميرا أولاً' : 'Camera must be activated first',
        variant: 'destructive',
      });
      return;
    }
    
    if (isScanning) return;
    
    setIsScanning(true);
    
    if (recognizedPlayer) {
      setRecognizedPlayer(null);
    }
  };
  
  // Mock function to simulate player recognition
  const recognizeRandomPlayer = () => {
    if (!cameraActive) return;
    
    const allPlayers = [
      ...match.homeTeam.players,
      ...match.awayTeam.players
    ];
    
    if (allPlayers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * allPlayers.length);
    const player = allPlayers[randomIndex];
    
    setRecognizedPlayer(player);
    
    toast({
      title: language === 'ar' ? 'تم التعرف على اللاعب' : 'Player Recognized',
      description: `${player.name} - #${player.jerseyNumber} (${player.team})`,
    });
  };
  
  const PlayerCard = ({ player }: { player: Player }) => {
    return (
      <div className="flex items-center p-3 bg-black bg-opacity-40 rounded-lg">
        <div className={`rounded-full p-2 mr-3 ${player.team === 'الهلال' ? 'bg-referee-blue' : 'bg-referee-red'}`}>
          <User size={24} />
        </div>
        <div>
          <h3 className="font-bold">{player.name}</h3>
          <div className="flex text-sm text-gray-300">
            <span className="mr-2">#{player.jerseyNumber}</span>
            <span>{player.team}</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="p-4 bg-black bg-opacity-30 border-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <ScanFace className="mr-2" size={20} />
          {translations.playerRecognition[language]}
        </h2>
        
        <button 
          onClick={startScanningProcess}
          disabled={!cameraActive || isScanning}
          className={`p-2 rounded-full ${
            cameraActive && !isScanning
              ? 'bg-referee-yellow text-black hover:bg-yellow-600' 
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          {isScanning ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Scan size={20} />
          )}
        </button>
      </div>
      
      {isScanning ? (
        <div className="p-3 bg-black bg-opacity-40 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">{language === 'ar' ? 'جاري التعرف على اللاعب...' : 'Recognition in progress...'}</span>
            <span className="text-sm font-medium">{confidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-referee-yellow h-2 rounded-full transition-all duration-300" 
              style={{ width: `${confidence}%` }}
            />
          </div>
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="bg-black bg-opacity-30 animate-pulse">
              {language === 'ar' ? 'تحليل الصورة' : 'Analyzing image'}
            </Badge>
          </div>
        </div>
      ) : recognizedPlayer ? (
        <PlayerCard player={recognizedPlayer} />
      ) : (
        <div 
          onClick={cameraActive ? startScanningProcess : undefined}
          className={`
            h-20 flex items-center justify-center rounded-lg border-2 border-dashed 
            ${cameraActive ? 'border-referee-yellow cursor-pointer recognition-box' : 'border-gray-700'}
          `}
        >
          <div className="text-center text-sm text-gray-400">
            {cameraActive 
              ? (language === 'ar' ? 'انقر للتعرف على اللاعب' : 'Click to recognize player')
              : (language === 'ar' ? 'قم بتفعيل الكاميرا أولاً' : 'Activate camera first')
            }
          </div>
        </div>
      )}
      
      {cameraActive && (
        <div className="mt-4 text-xs text-gray-400 grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <ScanFace size={16} className="mr-1 text-referee-yellow" />
            <span>{translations.faceRecognition[language]}</span>
          </div>
          <div className="flex items-center">
            <Shirt size={16} className="mr-1 text-referee-yellow" />
            <span>{translations.jerseyRecognition[language]}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PlayerRecognition;
