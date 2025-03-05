import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Social Analyzer",
  description: "Analyze comments from social platforms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-forest-night text-bright-snow">{children}</body>
      </html>
    </ClerkProvider>
  );
}
