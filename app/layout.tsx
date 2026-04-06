import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kettlebell Workout - Full Exercise Library",
  description: "28 kettlebell exercises from Men's Health with workout timer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
