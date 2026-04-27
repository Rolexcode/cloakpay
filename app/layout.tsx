import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloakPay — Private payment links on Solana",
  description: "Create shareable payment links. Your wallet, balance, and transaction history stay completely private — powered by Umbra on Solana.",
  openGraph: {
    title: "CloakPay",
    description: "Get paid privately on Solana. No wallet exposed.",
    type: "website",
  },
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