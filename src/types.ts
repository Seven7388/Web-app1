export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  summary?: string;
  content: string;
  imageUrl: string;
  additionalImages?: string[];
}

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: number[];
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  folder: 'inbox' | 'sent' | 'trash' | 'drafts';
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
  aiTip?: string;
}
