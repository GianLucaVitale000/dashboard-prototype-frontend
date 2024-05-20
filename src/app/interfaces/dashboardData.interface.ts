export interface DashboardDataResponse {
  type: string;
  title: string;
  subtitle: string;
  labels: string[];
}

export interface ConsumoIdrico {
  quantita: number;
  data: string;
}

export interface ConsumoIdricoResponse extends DashboardDataResponse {
  series: { label: string; data: ConsumoIdrico[] }[];
}

export interface EnergiaElettrica {
  quantita: number;
  data: string;
}

export interface EnergiaElettricaResponse extends DashboardDataResponse {
  series: { label: string; data: EnergiaElettrica[] }[];
}

export interface Fatturato {
  importo: number;
  data: string;
}

export interface FatturatoResponse extends DashboardDataResponse {
  series: { label: string; data: Fatturato[] }[];
}

export interface Prodotto {
  nome: string;
  prezzo: number;
}

export interface ProdottoResponse extends DashboardDataResponse {
  series: { label: string; data: Prodotto[] }[];
}

export interface Produzione {
  pezziProdotti: number;
  pezziDifettosi: number;
  data: string;
}

export interface ProduzioneResponse extends DashboardDataResponse {
  series: { label: string; data: Produzione[] }[];
}

export interface Rifiuto {
  quantita: number;
  percentuale: number;
  tipo: string;
}

export interface RifiutoResponse extends DashboardDataResponse {
  series: { label: string; data: Rifiuto[] }[];
}
