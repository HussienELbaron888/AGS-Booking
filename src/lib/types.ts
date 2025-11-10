export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  longDescription: string;
  image: string;
  seatingChart: SeatingChart;
  targetAudience: string;
  keyHighlights: string;
  venue: 'boys-theater' | 'girls-theater';
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
