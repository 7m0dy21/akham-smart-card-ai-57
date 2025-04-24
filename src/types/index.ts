
export type Language = 'ar' | 'en';

export type CardType = 'yellow' | 'red' | null;

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  team: string;
  position?: string;
  image?: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  players: Player[];
}

export interface CardIncident {
  id: string;
  timestamp: Date;
  player: Player;
  cardType: CardType;
  reason?: string;
  imageCapture?: string;
  videoEvidence?: string;
  aiAnalysis?: string;
  recommendedCard?: CardType;
  ruleReference?: string;
  decisionConfidence?: number;
}

export interface VarAnalysis {
  isReviewing: boolean;
  currentIncident: CardIncident | null;
  recommendedDecision: CardType;
  confidence: number;
  ruleReference: string | null;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  venue: string;
  competition?: string;
  incidents: CardIncident[];
  status: 'upcoming' | 'ongoing' | 'completed';
  score?: {
    homeScore: number;
    awayScore: number;
  };
  varAnalysis?: VarAnalysis;
  finalReport?: {
    summary: string;
    incidentReviews: CardIncident[];
    refereePerformance?: {
      accuracy: number;
      timeEfficiency: number;
      consistencyScore: number;
    }
  };
}
