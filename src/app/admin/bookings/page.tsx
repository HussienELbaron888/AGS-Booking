import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBookingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This is where you would manage all event bookings, view details, and handle refunds or cancellations. A list of all bookings would be displayed here in a data table.
        </p>
      </CardContent>
    </Card>
  );
}
