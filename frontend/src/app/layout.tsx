import type { Metadata } from "next";
import { SolanaProvider } from "@/components/SolanaProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Chaos World — Every Transaction Changes Reality",
  description: "A living blockchain world on Solana where every transaction shapes the fate of factions, territories, and the entire world. Trade, attack, and watch chaos unfold in real-time.",
  keywords: ["solana", "blockchain", "game", "defi", "chaos", "web3"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
