import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sponsorship Ops Tracker",
  description: "Personal sponsorship workflow and follow-up command center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
