import type { Metadata } from "next";
import { Marcellus, Mulish } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      data-theme="day"
      className={`${marcellus.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
