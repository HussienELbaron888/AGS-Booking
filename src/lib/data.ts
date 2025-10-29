import type { Event, SeatingChart, SeatingRow, Seat } from './types';
import { PlaceHolderImages } from './placeholder-images';

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


export const events: Event[] = [
  {
    id: '1',
    name: 'Annual School Play: A Midsummer Night\'s Dream',
    date: '2024-09-15',
    time: '18:00',
    description: 'Join us for a magical evening as our talented students perform Shakespeare\'s classic comedy.',
    longDescription: 'Our drama club has been working tirelessly to bring this enchanting story to life. Expect a night of laughter, romance, and spectacular performances under the stars (or at least under our new stage lights!). This is a perfect event for the whole family.',
    image: PlaceHolderImages.find(p => p.id === 'event-1')?.imageUrl || '',
    seatingChart: generateSeats(),
    targetAudience: "Parents, students, and family members",
    keyHighlights: "Live student performances, classic Shakespearean comedy, new stage lighting and sound system"
  },
  {
    id: '2',
    name: 'Science and Innovation Fair 2024',
    date: '2024-10-05',
    time: '10:00 - 16:00',
    description: 'Explore the brilliant minds of our students at the annual Science and Innovation Fair.',
    longDescription: 'From erupting volcanoes to advanced robotics, our students will showcase their incredible projects. Come and be inspired by the next generation of scientists, engineers, and innovators. Interactive exhibits and hands-on activities will be available for all ages.',
    image: PlaceHolderImages.find(p => p.id === 'event-2')?.imageUrl || '',
    seatingChart: generateSeats(),
    targetAudience: "Students, parents, and science enthusiasts",
    keyHighlights: "Student projects, robotics demonstrations, interactive exhibits"
  },
  {
    id: '3',
    name: 'Annual Sports Day',
    date: '2024-11-01',
    time: '09:00 - 15:00',
    description: 'Cheer on our student athletes in a day full of exciting competitions and team spirit.',
    longDescription: 'A day of thrilling athletic events, from track and field to team sports. Support your house, enjoy the competitive atmosphere, and celebrate sportsmanship. Food and refreshments will be available throughout the day.',
    image: PlaceHolderImages.find(p => p.id === 'event-3')?.imageUrl || '',
    seatingChart: generateSeats(),
    targetAudience: "Entire school community",
    keyHighlights: "Track and field events, team sports finals, house competitions"
  },
];

export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};
