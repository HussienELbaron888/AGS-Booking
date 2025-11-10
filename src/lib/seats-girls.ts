import type { SeatingChart, SeatingRow, Seat } from './types';

// A slightly different layout for the girls' theater for differentiation.
// For example, smaller sections.
export const generateSeatsGirls = (): SeatingChart => {
  const seatingChart: SeatingChart = { rows: [] };
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

  rowLetters.forEach((rowId) => {
    const row: SeatingRow = { id: rowId, seats: [] };

    // Left section (5 seats)
    for (let i = 5; i >= 1; i--) {
      row.seats.push({ id: `${rowId}L${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'left' });
    }

    // Aisle
    row.seats.push({ id: `${rowId}A1`, type: 'aisle', section: 'aisle' });

    // Center section (10 seats)
    for (let i = 1; i <= 10; i++) {
        row.seats.push({ id: `${rowId}C${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'center' });
    }

    // Aisle
    row.seats.push({ id: `${rowId}A2`, type: 'aisle', section: 'aisle' });

    // Right section (5 seats)
    for (let i = 1; i <= 5; i++) {
      row.seats.push({ id: `${rowId}R${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'right' });
    }

    seatingChart.rows.push(row);
  });

  return seatingChart;
};
