import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">イベント追加</h1>
          </div>
          <div className="max-w-2xl">
            <EventForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
