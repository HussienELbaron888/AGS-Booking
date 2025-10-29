import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      <AdminSidebar />
      <div className="flex-1 p-8 bg-muted/30">
        {children}
      </div>
    </div>
  );
}
