import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import GateApp from "@/app/components/gate-app";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "kosanjambe",
  description: "Urusan kos kamu, semuanya di satu tempat.",
  applicationName: "kosanjambe",
  // The landing page in web/ is the one that needs Google. Everything in here
  // sits behind a login and must stay out of the index.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  // Let the layout paint under the notch and the home indicator; the
  // safe-area spacing in tailwind.config.ts is what keeps content clear of them.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`}>
      <body className="bg-neutral-100 font-sans">
        {/* On a phone this is just the screen. On a desktop browser it keeps
            the app phone-width instead of stretching a mobile UI across 1900px. */}
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background shadow-sm">
          {children}
        </div>

        {/* Ditaruh di root biar nutup semua halaman, termasuk layar masuk. */}
        <GateApp />
      </body>
    </html>
  );
}
