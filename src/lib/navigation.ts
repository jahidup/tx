import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarClock,
  ClipboardList,
  FileQuestion,
  FolderOpen,
  GraduationCap,
  Home,
  LifeBuoy,
  Mail,
  Medal,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";

export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Classes", href: "/admin/classes", icon: GraduationCap },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Question Bank", href: "/admin/questions", icon: FileQuestion },
  { label: "Tests", href: "/admin/tests", icon: ClipboardList },
  { label: "Results", href: "/admin/results", icon: Medal },
  { label: "Study Materials", href: "/admin/materials", icon: FolderOpen },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
  { label: "AI Settings", href: "/admin/ai-settings", icon: Brain },
  { label: "System Settings", href: "/admin/settings", icon: Settings }
];

export const studentNav = [
  { label: "Home", href: "/student", icon: Home },
  { label: "Tests", href: "/student/live-tests", icon: CalendarClock },
  { label: "Results", href: "/student/results", icon: Medal },
  { label: "AI", href: "/student/results", icon: Brain },
  { label: "Profile", href: "/student/profile", icon: ShieldCheck }
];

export const publicNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Student Login", href: "/student-login" },
  { label: "Admin Login", href: "/admin-login" }
];

export const studentSideNav = [
  { label: "Dashboard", href: "/student", icon: Home },
  { label: "Upcoming Tests", href: "/student/upcoming-tests", icon: CalendarClock },
  { label: "Live Tests", href: "/student/live-tests", icon: ClipboardList },
  { label: "Previous Tests", href: "/student/previous-tests", icon: FolderOpen },
  { label: "Results", href: "/student/results", icon: Medal },
  { label: "Study Materials", href: "/student/materials", icon: BookOpen },
  { label: "Support", href: "/student/support", icon: LifeBuoy },
  { label: "Profile", href: "/student/profile", icon: ShieldCheck }
];
