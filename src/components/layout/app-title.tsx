
'use client';

// This component is created to specifically address a hydration
// error related to the application title. By isolating the title
// in its own client component without any state or side effects,
// we ensure consistent rendering between the server and the client.
export function AppTitle() {
  return <span>AGS Booking</span>;
}
