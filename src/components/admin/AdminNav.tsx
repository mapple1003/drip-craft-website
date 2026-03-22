"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, FileText, Store, Mail, QrCode, LogOut, CalendarDays } from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { href: "/admin/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/content", label: "サイト文章", icon: FileText },
  { href: "/admin/events", label: "イベント情報", icon: CalendarDays },
  { href: "/admin/stores", label: "取扱店舗", icon: Store },
  { href: "/admin/spots", label: "名所ページ", icon: QrCode },
  { href: "/admin/contacts", label: "お問い合わせ", icon: Mail },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("ログアウトしました");
    router.replace("/admin");
  };

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r bg-card">
      {/* Logo */}
      <div className="border-b px-6 py-5">
        <p className="text-xs text-muted-foreground">管理画面</p>
        <p className="font-bold tracking-widest text-primary">EKIREI</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          ログアウト
        </Button>
      </div>
    </aside>
  );
}
