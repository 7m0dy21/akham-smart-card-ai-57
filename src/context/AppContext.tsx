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

const mockIncidents: CardIncident[] = [
  {
    id: '1',
    timestamp: new Date(2025, 3, 25, 20, 15, 0),
    player: {
      id: '2',
      name: 'ياسر الشهراني',
      jerseyNumber: 13,
      team: 'الهلال'
    },
    cardType: 'yellow',
    reason: 'تدخل قوي من الخلف',
    aiAnalysis: 'تحليل الحالة يؤكد صحة قرار البطاقة الصفراء وفقاً للمادة 12.1 من قوانين اللعبة - تدخل متهور',
    videoEvidence: 'video-url-1',
    recommendedCard: 'yellow',
    ruleReference: 'المادة 12.1 - الأخطاء وسوء السلوك',
    decisionConfidence: 0.92
  },
  {
    id: '2',
    timestamp: new Date(2025, 3, 25, 20, 30, 0),
    player: {
      id: '5',
      name: 'سلطان الغنام',
      jerseyNumber: 2,
      team: 'النصر'
    },
    cardType: 'yellow',
    reason: 'اعتراض على قرار الحكم',
    aiAnalysis: 'تحليل الفيديو يظهر اعتراض واضح على قرار الحكم مما يستوجب البطاقة الصفراء',
    videoEvidence: 'video-url-2',
    recommendedCard: 'yellow',
    ruleReference: 'المادة 12.2 - سوء السلوك',
    decisionConfidence: 0.88
  },
  {
    id: '3',
    timestamp: new Date(2025, 3, 25, 20, 45, 0),
    player: {
      id: '6',
      name: 'عبدالله مادو',
      jerseyNumber: 5,
      team: 'النصر'
    },
    cardType: 'red',
    reason: 'تدخل عنيف يعرض سلامة المنافس للخطر',
    aiAnalysis: 'تحليل متعدد الزوايا يؤكد خطورة التدخل واستحقاق البطاقة الحمراء وفقاً لقوانين اللعبة',
    videoEvidence: 'video-url-3',
    recommendedCard: 'red',
    ruleReference: 'المادة 12.3 - اللعب العنيف',
    decisionConfidence: 0.96
  }
];

const mockMatch: Match = {
  id: '1',
  homeTeam: mockHomeTeam,
  awayTeam: mockAwayTeam,
  date: new Date(),
  venue: 'ملعب الملك فهد الدولي',
  competition: 'دوري روشن السعودي',
  incidents: mockIncidents,
  status: 'ongoing',
  score: {
    homeScore: 1,
    awayScore: 1,
  },
  varAnalysis: {
    isReviewing: false,
    currentIncident: null,
    recommendedDecision: null,
    confidence: 0,
    ruleReference: null
  },
  finalReport: {
    summary: '',
    incidentReviews: mockIncidents,
    refereePerformance: {
      accuracy: 92,
      timeEfficiency: 88,
      consistencyScore: 90
    }
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
    },
    varScreen: {
      ar: 'شاشة الفار',
      en: 'VAR Screen'
    },
    recommendedDecision: {
      ar: 'القرار المقترح',
      en: 'Recommended Decision'
    },
    incidentUnderReview: {
      ar: 'الحالة قيد المراجعة',
      en: 'Incident under review'
    },
    viewVideo: {
      ar: 'عرض الفيديو',
      en: 'View Video'
    },
    lawReference: {
      ar: 'وفقًا للقانون',
      en: 'According to Law'
    },
    scan: {
      ar: 'مسح',
      en: 'Scan'
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
    
    // Simulate VAR analysis
    const confidence = Math.random() * 0.3 + 0.7; // Random confidence between 70% and 100%
    const ruleReference = 'المادة 12 - الأخطاء وسوء السلوك';
    
    const aiAnalysis = language === 'ar' 
      ? `تم تحليل الحالة بنسبة ثقة ${(confidence * 100).toFixed(1)}%: مخالفة مستحقة للبطاقة ${cardType === 'yellow' ? 'الصفراء' : 'الحمراء'} وفقاً لقوانين اللعبة ${ruleReference}`
      : `Incident analyzed with ${(confidence * 100).toFixed(1)}% confidence: Violation warranting a ${cardType === 'yellow' ? 'Yellow' : 'Red'} card according to ${ruleReference}`;
    
    const newIncident: CardIncident = {
      id: Date.now().toString(),
      timestamp: new Date(),
      player,
      cardType,
      reason,
      aiAnalysis,
      videoEvidence: 'video-evidence-url',
      recommendedCard: cardType,
      ruleReference,
      decisionConfidence: confidence
    };
    
    // Update match with new incident and VAR analysis
    setMatch(prevMatch => ({
      ...prevMatch,
      incidents: [newIncident, ...prevMatch.incidents],
      varAnalysis: {
        isReviewing: true,
        currentIncident: newIncident,
        recommendedDecision: cardType,
        confidence,
        ruleReference
      }
    }));
    
    // Reset state after 3 seconds
    setTimeout(() => {
      setRecognizedPlayer(null);
      setSelectedCardType(null);
      setMatch(prevMatch => ({
        ...prevMatch,
        varAnalysis: {
          isReviewing: false,
          currentIncident: null,
          recommendedDecision: null,
          confidence: 0,
          ruleReference: null
        }
      }));
    }, 3000);
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
