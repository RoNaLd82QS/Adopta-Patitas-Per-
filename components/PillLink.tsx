"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PillLink({
  href,
  children,
  exact = false,
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "rounded-full border px-4 py-1.5",
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
