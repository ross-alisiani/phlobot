import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phlobot – Mobile Exam Scheduling",
  description: "The fastest way to schedule a mobile paramedical exam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
