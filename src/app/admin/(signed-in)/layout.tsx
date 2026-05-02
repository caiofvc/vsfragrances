import { requireAdmin } from "@/lib/auth/admin";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex bg-offwhite">
      <Sidebar email={session.email} fullName={session.fullName} />
      <div className="flex-1 min-h-screen">
        <div className="px-10 py-8">{children}</div>
      </div>
    </div>
  );
}
