
import React from 'react';
import { AppProvider } from '../context/AppContext';
import Header from '../components/Header';
import MatchDetails from '../components/MatchDetails';
import IncidentHistory from '../components/IncidentHistory';
import PlayerRecognition from '../components/PlayerRecognition';
import CardControls from '../components/CardControls';
import CameraView from '../components/CameraView';
import VarScreen from '../components/VarScreen';
import FinalReportDialog from '../components/FinalReportDialog';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-b from-referee-blue to-black text-white">
        <Header />
        
        <div className="container mx-auto py-3 px-2 md:py-6 md:px-4">
          <div className="flex justify-end mb-4">
            <FinalReportDialog />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <CameraView />
            <VarScreen />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              <PlayerRecognition />
              <CardControls />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <MatchDetails />
              <IncidentHistory />
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
};

export default Index;
