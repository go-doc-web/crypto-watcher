export interface Coin {
  id: number;
  documentId: string;
  symbol: string;
  price: number;
  change24h: number | null;
  updatedAt: string;
}

export interface Alert {
  id: number;
  symbol: string;
  targetPrice: number;
  isActive: boolean;
}
