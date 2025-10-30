
import { db } from '../src/lib/firebase';
import { collection, addDoc, getDocs, doc, writeBatch } from 'firebase/firestore';
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

const resetAllSeats = async () => {
    console.log('Fetching all events to reset seat statuses...');
    const eventsCollection = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    const batch = writeBatch(db);
  
    eventsSnapshot.forEach((eventDoc) => {
      console.log(`Processing event: ${eventDoc.id}`);
      const eventData = eventDoc.data() as Event;
      const seatingChart = eventData.seatingChart;
  
      if (seatingChart && seatingChart.rows) {
        seatingChart.rows.forEach(row => {
          row.seats.forEach(seat => {
            if (seat.status !== 'available') {
                seat.status = 'available';
            }
          });
        });
  
        const eventRef = doc(db, 'events', eventDoc.id);
        batch.update(eventRef, { seatingChart: seatingChart });
        console.log(`- Queued update for event ${eventDoc.id}`);
      }
    });
  
    try {
      await batch.commit();
      console.log('Successfully reset all seat statuses across all events.');
    } catch (error) {
      console.error('Error committing batch update for seat reset:', error);
    }
  };

// addEvent();
resetAllSeats();
