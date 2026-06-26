import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress";

export const metadata: Metadata = {
  title: "מסחר יומי למתחילים - מ־0 לתוכנית מסחר ממושמעת",
  description:
    "קורס אינטראקטיבי ללימוד עצמי של מסחר יומי למתחילים: קריאת גרפים, ניהול סיכונים, פסיכולוגיה, ובניית תוכנית מסחר. לחינוך בלבד.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f61ef",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=JSON.parse(localStorage.getItem('dtc_progress_v1')||'{}').theme;if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
