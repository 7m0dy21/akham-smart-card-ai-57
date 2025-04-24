
import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const FinalReportDialog: React.FC = () => {
  const { language, match } = useAppContext();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-referee-blue hover:bg-referee-blue/80 text-white border-0"
        >
          <FileText className="mr-2" />
          {language === 'ar' ? 'التقرير النهائي' : 'Final Report'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-black/95 text-white border-referee-blue">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {language === 'ar' ? 'التقرير النهائي للمباراة' : 'Match Final Report'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] mt-4">
          <div className="space-y-6">
            {/* Match Summary */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ar' ? 'ملخص المباراة' : 'Match Summary'}
              </h3>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <p className="font-bold">{match.homeTeam.name}</p>
                    <p className="text-2xl">{match.score?.homeScore || 0}</p>
                  </div>
                  <div className="text-referee-yellow">VS</div>
                  <div className="text-center">
                    <p className="font-bold">{match.awayTeam.name}</p>
                    <p className="text-2xl">{match.score?.awayScore || 0}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Incidents Review */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ar' ? 'مراجعة الحالات' : 'Incidents Review'}
              </h3>
              <div className="space-y-3">
                {match.incidents.map((incident, index) => (
                  <div key={incident.id} className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{incident.player.name}</span>
                      <div 
                        className={`w-4 h-6 rounded-sm ${
                          incident.cardType === 'yellow' ? 'bg-referee-yellow' : 'bg-referee-red'
                        }`}
                      />
                    </div>
                    {incident.aiAnalysis && (
                      <p className="text-sm text-gray-300 mt-2">{incident.aiAnalysis}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Referee Performance */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ar' ? 'تقييم أداء الحكم' : 'Referee Performance'}
              </h3>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'دقة القرارات' : 'Decision Accuracy'}</span>
                    <span className="text-referee-yellow">
                      {match.finalReport?.refereePerformance?.accuracy || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'كفاءة الوقت' : 'Time Efficiency'}</span>
                    <span className="text-referee-yellow">
                      {match.finalReport?.refereePerformance?.timeEfficiency || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'ثبات القرارات' : 'Decision Consistency'}</span>
                    <span className="text-referee-yellow">
                      {match.finalReport?.refereePerformance?.consistencyScore || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FinalReportDialog;
