import type { SeatingChart, SeatingRow, Seat } from './types';

export const generateSeats = (): SeatingChart => {
  const seatingChart: SeatingChart = { rows: [] };
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  
  rowLetters.forEach((rowId, rowIndex) => {
    const row: SeatingRow = { id: rowId, seats: [] };
    
    // Left section (4 seats)
    for (let i = 1; i <= 4; i++) {
      const seat: Seat = {
        id: `${rowId}L${i}`,
        number: `${i}`,
        status: Math.random() > 0.3 ? 'available' : 'unavailable',
        type: 'seat',
        section: 'left',
      };
      row.seats.push(seat);
    }
    
    // Aisle (empty space)
    row.seats.push({ id: `${rowId}-aisle1`, number: '', status: 'available', type: 'aisle', section: 'aisle' });
    
    // Center section (8 seats)
    for (let i = 1; i <= 8; i++) {
      // Skip seats in the first row of Section C
      if (rowIndex === 0) {
          row.seats.push({
              id: `${rowId}C${i}`,
              number: '',
              status: 'available',
              type: 'empty',
              section: 'center',
          });
          continue;
      }
      const seat: Seat = {
        id: `${rowId}C${i}`,
        number: `${i}`,
        status: Math.random() > 0.3 ? 'available' : 'unavailable',
        type: 'seat',
        section: 'center',
      };
      row.seats.push(seat);
    }
    
    // Aisle (empty space)
    row.seats.push({ id: `${rowId}-aisle2`, number: '', status: 'available', type: 'aisle', section: 'aisle' });

    // Right section (4 seats)
    for (let i = 1; i <= 4; i++) {
      const seat: Seat = {
        id: `${rowId}R${i}`,
        number: `${i}`,
        status: Math.random() > 0.3 ? 'available' : 'unavailable',
        type: 'seat',
        section: 'right',
      };
      row.seats.push(seat);
    }
    
    seatingChart.rows.push(row);
  });

  return seatingChart;
};
