"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layout",
  },
  {
    title: "Loan Estimates",
    href: "/loan-estimates",
    icon: "file-text",
  },
  {
    title: "My Bids",
    href: "/my-bids",
    icon: "gavel",
  },
  {
    title: "Leads",
    href: "/leads",
    icon: "users",
  },
  {
    title: "Activity",
    href: "/activity",
    icon: "activity",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.href}
          >
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent"
              )}
            >
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
