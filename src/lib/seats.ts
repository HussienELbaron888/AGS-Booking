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
        status: 'available',
        type: 'seat',
        section: 'left',
      };
      row.seats.push(seat);
    }
    
    // Aisle (empty space)
    row.seats.push({ id: `${rowId}-aisle1`, number: '', status: 'available', type: 'aisle', section: 'aisle' });
    
    // Center section (8 seats)
    if (rowIndex === 0) { // If it's the first row (Row A)
        // Add empty spaces instead of seats for the center section
        for (let i = 1; i <= 8; i++) {
            const seat: Seat = {
                id: `${rowId}C${i}-empty`,
                number: '',
                status: 'unavailable',
                type: 'empty',
                section: 'center',
            };
            row.seats.push(seat);
        }
    } else {
        for (let i = 1; i <= 8; i++) {
          const seat: Seat = {
            id: `${rowId}C${i}`,
            number: `${i}`,
            status: 'available',
            type: 'seat',
            section: 'center',
          };
          row.seats.push(seat);
        }
    }
    
    // Aisle (empty space)
    row.seats.push({ id: `${rowId}-aisle2`, number: '', status: 'available', type: 'aisle', section: 'aisle' });

    // Right section (4 seats)
    for (let i = 1; i <= 4; i++) {
      const seat: Seat = {
        id: `${rowId}R${i}`,
        number: `${i}`,
        status: 'available',
        type: 'seat',
        section: 'right',
      };
      row.seats.push(seat);
    }
    
    seatingChart.rows.push(row);
  });

  return seatingChart;
};
