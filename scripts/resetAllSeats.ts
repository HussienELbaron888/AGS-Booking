
import { db } from '../src/lib/firebase';
import { collection, addDoc, getDocs, doc, writeBatch } from 'firebase/firestore';
import { Event } from '../src/lib/types';
import { PlaceHolderImages } from '../src/lib/placeholder-images';
import { generateSeats } from '../src/lib/seats';

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
      
      const newSeatingChart = generateSeats(); // Generate a completely fresh seating chart
  
      const eventRef = doc(db, 'events', eventDoc.id);
      batch.update(eventRef, { seatingChart: newSeatingChart });
      console.log(`- Queued reset for event ${eventDoc.id}`);
    });
  
    try {
      await batch.commit();
      console.log('Successfully reset all seat statuses across all events.');
    } catch (error) {
      console.error('Error committing batch update for seat reset:', error);
    }
  };

// To add a new event, uncomment the line below
// addEvent();

// To reset all seats in all existing events, uncomment the line below
resetAllSeats();
