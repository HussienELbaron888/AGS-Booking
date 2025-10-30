
import { db } from '../src/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Event, SeatingChart, SeatingRow, Seat } from '../src/lib/types';
import { PlaceHolderImages } from '../src/lib/placeholder-images';

const generateSeats = (): SeatingChart => {
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
        status: 'available',
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

const newEvent: Omit<Event, 'id'> = {
  name: 'Theater Performance - Journey of Dreams',
  date: '2025-05-20',
  time: '19:00',
  description: 'A special theatrical performance produced and performed by the school\'s students. An inspiring story about achieving dreams.',
  longDescription: 'A special theatrical performance produced and performed by the school\'s students. An inspiring story about achieving dreams. This event showcases the creativity and talent of our students, and we invite you to come and support them.',
  image: PlaceHolderImages.find(p => p.id === 'event-4')?.imageUrl || '',
  seatingChart: generateSeats(),
  targetAudience: 'All students, parents, and staff',
  keyHighlights: 'Student-led production, inspiring storyline, creative performances',
};

const addEvent = async () => {
  try {
    const docRef = await addDoc(collection(db, 'events'), newEvent);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

addEvent();
