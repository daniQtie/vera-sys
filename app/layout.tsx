import type { Metadata } from "next";
import { Playfair_Display, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { PageLoader } from "@/components/page-loader";
import { SITE_URL } from "@/lib/env";
import { PROFILE } from "@/lib/seed-data";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const description = `${PROFILE.name} is a ${PROFILE.role} from ${PROFILE.location}, building e-commerce, booking systems, and full-stack management platforms from database to pixel.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PROFILE.name} — ${PROFILE.role}`,
    template: `%s · ${PROFILE.name}`,
  },
  description,
  keywords: [
    "Daniel De Vera",
    "Full Stack Developer",
    "Web Developer Philippines",
    "Booking System Developer",
    "E-commerce Developer",
    "PHP",
    "Laravel",
    "React",
    "Next.js",
    "MySQL",
    "Hotel Website",
    "Pangasinan",
  ],
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: `${PROFILE.name} — Portfolio`,
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${PROFILE.name}, ${PROFILE.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/DDV.2.png", apple: "/DDV.2.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geist.variable} ${playfair.variable} ${geistMono.variable} grain antialiased`}
      >
        <ThemeProvider>
          <PageLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
