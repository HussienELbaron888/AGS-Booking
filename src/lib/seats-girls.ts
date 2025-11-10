import type { SeatingChart, SeatingRow, Seat } from './types';

// Seating chart layout based on the provided image for the girls' theater
export const generateSeatsGirls = (): SeatingChart => {
  const seatingChart: SeatingChart = { rows: [] };
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];

  const sectionSeatCounts: Record<string, Record<string, number>> = {
    L: { A: 2, B: 8, C: 8, D: 8, E: 8, F: 8, G: 8, H: 8, I: 8, J: 8, K: 8, L: 8, M: 8, N: 8, O: 8, P: 8, Q: 0 },
    C: { A: 10, B: 11, C: 10, D: 11, E: 11, F: 11, G: 11, H: 11, I: 10, J: 11, K: 10, L: 11, M: 10, N: 11, O: 10, P: 11, Q: 10 },
    R: { A: 2, B: 8, C: 8, D: 8, E: 8, F: 8, G: 8, H: 8, I: 8, J: 8, K: 8, L: 8, M: 8, N: 8, O: 8, P: 8, Q: 0 },
  };

  const maxSeatsLeft = 8;
  const maxSeatsCenter = 11;
  const maxSeatsRight = 8;

  rowLetters.forEach((rowId) => {
    const row: SeatingRow = { id: rowId, seats: [] };

    // Left Section (Numbered right-to-left, e.g., 8, 7, ..., 1)
    const leftSeatsCount = sectionSeatCounts.L[rowId] || 0;
    // Add empty placeholders to the left to keep alignment with longer rows below
    for (let i = 0; i < maxSeatsLeft - leftSeatsCount; i++) {
        row.seats.push({ id: `${rowId}L_empty_pad_${i}`, type: 'empty', section: 'left' });
    }
    // Add the actual seats, numbering from count down to 1
    for (let i = leftSeatsCount; i >= 1; i--) {
      row.seats.push({ id: `${rowId}L${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'left' });
    }

    // Aisle 1
    row.seats.push({ id: `${rowId}A1`, type: 'aisle', section: 'aisle' });

    // Center Section (Numbered left-to-right)
    const centerSeatsCount = sectionSeatCounts.C[rowId] || 0;
    for (let i = 1; i <= centerSeatsCount; i++) {
      row.seats.push({ id: `${rowId}C${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'center' });
    }
     // Add empty placeholders to fill remaining space if the row is shorter than the max
     for (let i = 0; i < maxSeatsCenter - centerSeatsCount; i++) {
        row.seats.push({ id: `${rowId}C_empty_pad_${i}`, type: 'empty', section: 'center' });
    }

    // Aisle 2
    row.seats.push({ id: `${rowId}A2`, type: 'aisle', section: 'aisle' });

    // Right Section (Numbered left-to-right)
    const rightSeatsCount = sectionSeatCounts.R[rowId] || 0;
    for (let i = 1; i <= rightSeatsCount; i++) {
      row.seats.push({ id: `${rowId}R${i}`, number: `${i}`, status: 'available', type: 'seat', section: 'right' });
    }
    // Add empty placeholders to fill remaining space
    for (let i = 0; i < maxSeatsRight - rightSeatsCount; i++) {
        row.seats.push({ id: `${rowId}R_empty_pad_${i}`, type: 'empty', section: 'right' });
    }
    
    // Only add the row if it has actual seats
    if (row.seats.some(s => s.type === 'seat')) {
        seatingChart.rows.push(row);
    }
  });

  return seatingChart;
};
