import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getvellox.vercel.app"),
  title: {
    default: "velloX - Project Management System",
    template: "%s | velloX"
  },
  description: "Experience a new atmosphere of productivity. VelloX is a premium task management platform designed to bring clarity and speed to your workflow.",
  keywords: ["task management", "project management", "productivity", "collaboration", "workflow"],
  authors: [{ name: "velloX Team" }],
  creator: "velloX",
  openGraph: {
    title: "velloX - Project Management System",
    description: "Experience a new atmosphere of productivity. VelloX is designed to bring clarity and speed to your workflow.",
    url: "https://getvellox.vercel.app", 
    siteName: "velloX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "velloX - Premium Task Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "velloX - Premium Task Management",
    description: "Experience a new atmosphere of productivity with velloX.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://getvellox.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${manrope.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster richColors/>
        </AuthProvider>
      </body>
    </html>
  );
}
