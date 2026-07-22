import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "ReStock by Ledger",
  description: "Procurement, handled calmly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full font-sans">
        <AppStoreProvider>
          <div className="device-viewport">
            <div className="device-frame">{children}</div>
          </div>
        </AppStoreProvider>
      </body>
    </html>
  );
}
