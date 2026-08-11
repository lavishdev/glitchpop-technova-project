import { NavCategory } from "@/types/navigation";

export const NAVIGATION_CATEGORIES: NavCategory[] = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        label: "Dashboard Overview",
        href: "/",
        icon: "dashboard",
        category: "main",
      },
      {
        id: "dashboard-enhanced",
        label: "Dashboard Enhanced",
        href: "/dashboard/enhanced",
        icon: "insights",
        category: "main",
      },
      {
        id: "mission-control",
        label: "Mission Control",
        href: "/mission-control",
        icon: "radar",
        badge: "LIVE",
        badgeColor: "bg-emerald-500 text-white",
        category: "main",
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        id: "analytics",
        label: "Crowd Analytics",
        href: "/analytics",
        icon: "analytics",
        category: "operations",
      },
      {
        id: "alerts",
        label: "Alerts History",
        href: "/alerts",
        icon: "warning",
        badge: 14,
        badgeColor: "bg-error text-white",
        category: "operations",
      },
      {
        id: "camera",
        label: "Camera Infrastructure",
        href: "/camera",
        icon: "videocam",
        category: "operations",
      },
      {
        id: "incidents",
        label: "Incident Management",
        href: "/incidents",
        icon: "local_police",
        category: "operations",
      },
      {
        id: "emergency",
        label: "Emergency Response",
        href: "/emergency",
        icon: "e911_emergency",
        badge: "RED ALERT",
        badgeColor: "bg-red-600 text-white animate-pulse",
        category: "operations",
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        id: "users",
        label: "User Management",
        href: "/users",
        icon: "group",
        category: "management",
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        href: "/audit-logs",
        icon: "receipt_long",
        category: "management",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: "settings",
        category: "system",
      },
    ],
  },
];
