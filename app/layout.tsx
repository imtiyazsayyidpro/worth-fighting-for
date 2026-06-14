import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";
import { DecorativeBackground } from "@/components/layout/decorative-background";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const siteUrl = "https://worth-fighting-for.imtiyazsayyid.in";
const title = "Worth Fighting For";
const description =
  "A space for the two of you, whenever you need it — to slow down, listen, and find your way back to one another.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Worth Fighting For",
  },
  description,
  applicationName: title,
  keywords: [
    "relationships",
    "couples",
    "communication",
    "conflict resolution",
    "guided check-ins",
    "marriage",
    "partners",
  ],
  authors: [{ name: "Imtiyaz Sayyid" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: title,
    title,
    description,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DecorativeBackground />
        {children}
      </body>
    </html>
  );
}
