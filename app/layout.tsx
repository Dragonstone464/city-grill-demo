import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "City Grill Gummersbach | Frisch. Lecker. Direkt zu dir.",
  description: "Demo-Webseite für City Grill in Gummersbach – Speisekarte und Online-Bestellung.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}
