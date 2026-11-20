import type { Metadata } from "next";
import { Pixelify_Sans, VT323 } from "next/font/google";
import "./globals.css";

const pixel = Pixelify_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-pixel" });
const body = VT323({ subsets: ["latin"], weight: "400", variable: "--font-body" });

export const metadata: Metadata = {
  title: "Tripti Mandal | AI Engineer",
  description:
    "Portfolio of Tripti Mandal, AI Engineer building production LLM agent systems: tool-calling agents, context engineering, evals and guardrails.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
