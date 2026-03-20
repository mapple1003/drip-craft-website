"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { getContacts } from "@/lib/firestore";
import type { ContactDoc } from "@/types/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail } from "lucide-react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContacts()
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">お問い合わせ一覧</h1>
            <p className="text-muted-foreground">届いたお問い合わせを確認できます</p>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : contacts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <Mail size={40} className="text-muted-foreground/40" />
                <p className="text-muted-foreground">まだお問い合わせはありません</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        {contact.createdAt.toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {contact.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
