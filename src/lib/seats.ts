import type { SeatingChart, SeatingRow, Seat } from './types';

export const generateSeats = (): SeatingChart => {
  const seatingChart: SeatingChart = { rows: [] };
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

  rowLetters.forEach((rowId, rowIndex) => {
    const row: SeatingRow = { id: rowId, seats: [] };

    // Left section (7 seats) - Numbering from right to left (7 down to 1)
    for (let i = 7; i >= 1; i--) {
      row.seats.push({ id: `${rowId}L${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'left' });
    }

    // Aisle
    row.seats.push({ id: `${rowId}A1`, type: 'aisle', section: 'aisle' });

    // Center section (12 seats)
    if (rowIndex !== 0) { // All rows except the first one ('A')
        for (let i = 1; i <= 12; i++) {
          row.seats.push({ id: `${rowId}C${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'center' });
        }
    } else {
      // For Row A, add empty placeholders for the center section
      for (let i = 1; i <= 12; i++) {
        row.seats.push({ id: `${rowId}C_empty_${i}`, type: 'empty', section: 'center' });
      }
    }

    // Aisle
    row.seats.push({ id: `${rowId}A2`, type: 'aisle', section: 'aisle' });

    // Right section (7 seats)
    for (let i = 1; i <= 7; i++) {
      row.seats.push({ id: `${rowId}R${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'right' });
    }

    seatingChart.rows.push(row);
  });

  return seatingChart;
};
