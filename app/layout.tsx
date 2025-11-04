import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Transaction Visualizer",
  description: "Real-time visualization of Base blockchain transactions",
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
