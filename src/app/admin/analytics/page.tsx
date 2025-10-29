import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This section would feature detailed charts and reports on ticket sales, revenue, event popularity, and user demographics to provide insights into event performance.
        </p>
      </CardContent>
    </Card>
  );
}
