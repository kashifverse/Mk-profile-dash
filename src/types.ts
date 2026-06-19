export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  tools: string[];
  image: string;
  date: string;
  featured?: boolean;
  coordinates: string;
  caseStudy: {
    background: string;
    challenge: string;
    methodology: string;
    results: string;
  };
}

export interface ChatHistoryItem {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface MapPreset {
  id: string;
  name: string;
  lat: number;
  lng: number;
  coordinatesLabel: string;
  description: string;
  elevationRanges: number[];
  baseShapeSeed: number;
}

export interface SavedContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  replyText?: string;
}
