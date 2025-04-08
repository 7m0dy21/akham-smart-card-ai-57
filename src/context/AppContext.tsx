
import React, { createContext, useState, useContext } from 'react';
import { Language, CardType, Player, Team, CardIncident, Match } from '../types';

// Mock data for initial state
const mockHomeTeam: Team = {
  id: '1',
  name: 'الهلال',
  players: [
    { id: '1', name: 'محمد العويس', jerseyNumber: 1, team: 'الهلال' },
    { id: '2', name: 'ياسر الشهراني', jerseyNumber: 13, team: 'الهلال' },
    { id: '3', name: 'علي البليهي', jerseyNumber: 4, team: 'الهلال' },
  ]
};

const mockAwayTeam: Team = {
  id: '2',
  name: 'النصر',
  players: [
    { id: '4', name: 'وليد عبدالله', jerseyNumber: 1, team: 'النصر' },
    { id: '5', name: 'سلطان الغنام', jerseyNumber: 2, team: 'النصر' },
    { id: '6', name: 'عبدالله مادو', jerseyNumber: 5, team: 'النصر' },
  ]
};

const mockMatch: Match = {
  id: '1',
  homeTeam: mockHomeTeam,
  awayTeam: mockAwayTeam,
  date: new Date(),
  venue: 'ملعب الملك فهد الدولي',
  competition: 'دوري روشن السعودي',
  incidents: [],
  status: 'ongoing',
  score: {
    homeScore: 0,
    awayScore: 0,
  }
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  match: Match;
  setMatch: (match: Match) => void;
  cameraActive: boolean;
  setCameraActive: (active: boolean) => void;
  recognizedPlayer: Player | null;
  setRecognizedPlayer: (player: Player | null) => void;
  selectedCardType: CardType;
  setSelectedCardType: (type: CardType) => void;
  issueCard: (player: Player, cardType: CardType, reason?: string) => void;
  translations: Record<string, Record<Language, string>>;
}

const defaultContextValue: AppContextType = {
  language: 'ar',
  setLanguage: () => {},
  match: mockMatch,
  setMatch: () => {},
  cameraActive: false,
  setCameraActive: () => {},
  recognizedPlayer: null,
  setRecognizedPlayer: () => {},
  selectedCardType: null,
  setSelectedCardType: () => {},
  issueCard: () => {},
  translations: {
    appTitle: {
      ar: 'بطاقة الحكم الذكية',
      en: 'Smart Referee Card'
    },
    camera: {
      ar: 'الكاميرا',
      en: 'Camera'
    },
    activate: {
      ar: 'تفعيل',
      en: 'Activate'
    },
    deactivate: {
      ar: 'إيقاف',
      en: 'Deactivate'
    },
    capture: {
      ar: 'التقاط',
      en: 'Capture'
    },
    yellowCard: {
      ar: 'بطاقة صفراء',
      en: 'Yellow Card'
    },
    redCard: {
      ar: 'بطاقة حمراء',
      en: 'Red Card'
    },
    playerRecognition: {
      ar: 'التعرف على اللاعب',
      en: 'Player Recognition'
    },
    issueCard: {
      ar: 'إشهار البطاقة',
      en: 'Issue Card'
    },
    matchDetails: {
      ar: 'تفاصيل المباراة',
      en: 'Match Details'
    },
    incidentHistory: {
      ar: 'سجل الحالات',
      en: 'Incident History'
    },
    noIncidents: {
      ar: 'لا توجد حالات مسجلة',
      en: 'No incidents recorded'
    },
    time: {
      ar: 'الوقت',
      en: 'Time'
    },
    player: {
      ar: 'اللاعب',
      en: 'Player'
    },
    team: {
      ar: 'الفريق',
      en: 'Team'
    },
    card: {
      ar: 'البطاقة',
      en: 'Card'
    },
    reason: {
      ar: 'السبب',
      en: 'Reason'
    },
    enterReason: {
      ar: 'أدخل السبب...',
      en: 'Enter reason...'
    },
    features: {
      ar: 'المميزات',
      en: 'Features'
    },
    aiAnalysis: {
      ar: 'تحليل الذكاء الاصطناعي',
      en: 'AI Analysis'
    },
    faceRecognition: {
      ar: 'التعرف على الوجه',
      en: 'Face Recognition'
    },
    jerseyRecognition: {
      ar: 'التعرف على رقم القميص',
      en: 'Jersey Number Recognition'
    },
    instantAnalysis: {
      ar: 'التحليل الفوري',
      en: 'Instant Analysis'
    },
    finalReport: {
      ar: 'التقرير النهائي',
      en: 'Final Report'
    }
  }
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [match, setMatch] = useState<Match>(mockMatch);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [recognizedPlayer, setRecognizedPlayer] = useState<Player | null>(null);
  const [selectedCardType, setSelectedCardType] = useState<CardType>(null);

  const issueCard = (player: Player, cardType: CardType, reason?: string) => {
    if (!player || !cardType) return;
    
    const newIncident: CardIncident = {
      id: Date.now().toString(),
      timestamp: new Date(),
      player,
      cardType,
      reason,
      aiAnalysis: 'تم تحليل الحالة: مخالفة مستحقة للبطاقة وفقًا لقوانين اللعبة المادة 12',
      videoEvidence: 'video-evidence-url'
    };
    
    setMatch(prevMatch => ({
      ...prevMatch,
      incidents: [newIncident, ...prevMatch.incidents]
    }));
    
    setRecognizedPlayer(null);
    setSelectedCardType(null);
  };
  
  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        match,
        setMatch,
        cameraActive,
        setCameraActive,
        recognizedPlayer,
        setRecognizedPlayer,
        selectedCardType,
        setSelectedCardType,
        issueCard,
        translations: defaultContextValue.translations
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
