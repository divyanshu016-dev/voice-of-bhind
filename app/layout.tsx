import type { Metadata } from "next";
import "../src/visual.css";

export const metadata: Metadata = {
  title: "Voice of Bhind — भिंड की आवाज़ | Community Priorities",
  description: "A collective public voice for Bhind. Vote on community priorities, see what matters to residents, and share issues with everyone.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
