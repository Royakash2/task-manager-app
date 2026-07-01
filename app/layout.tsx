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
  title: "Aura",
  description: "Experience a new atmosphere of productivity. Aura is a premium task management platform designed to bring clarity and speed to your workflow.",
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
