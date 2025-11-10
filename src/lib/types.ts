export interface Event {
  id: string;
  name: string; // This will be used as a fallback or for internal display. UI will use name_en/name_ar
  name_en: string;
  name_ar: string;
  date: string;
  time: string;
  description: string;
  description_en: string;
  description_ar: string;
  longDescription: string;
  longDescription_en: string;
  longDescription_ar: string;
  image: string;
  seatingChart: SeatingChart;
  keyHighlights: string;
  venue: 'boys-theater' | 'girls-theater';
  totalSeats: number;
  seatsAvailable: number;
}

export interface SeatingChart {
  rows: SeatingRow[];
}

export interface SeatingRow {
  id: string;
  seats: Seat[];
}

export type SeatStatus = 'available' | 'unavailable' | 'selected' | 'reserved';
export type SeatSection = 'left' | 'center' | 'right' | 'aisle';

export interface Seat {
  id: string;
  number?: string;
  status?: SeatStatus;
  type: 'seat' | 'aisle' | 'empty';
  section: SeatSection;
}
