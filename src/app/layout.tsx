import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sankalp Digital Pathshala Test Portal",
    template: "%s | Sankalp Digital Pathshala"
  },
  description:
    "Enterprise online examination and learning platform for students, test administrators, results, AI explanations, study material and support.",
  applicationName: "Sankalp Digital Pathshala Test Portal",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
