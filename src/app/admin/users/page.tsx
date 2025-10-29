import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This interface would allow administrators to view, search, and manage user accounts. Actions could include viewing booking history, resetting passwords, or managing user roles.
        </p>
      </CardContent>
    </Card>
  );
}
