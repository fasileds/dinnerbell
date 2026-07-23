import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import SessionWarper from "@/components/SecionWarper";
import { VideoProvider } from "./context/VideoContext";
import { AuthProvider } from "./context/AuthContext";
export const metadata: Metadata = {
  title: {
    template: "%s | Acme Dashboard",
    default: "Dinar Bell",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/bb.png" />
      </head>
      <SessionWarper>
        <AuthProvider>
          <VideoProvider>
            <body className={`${inter.className} antialiased`}>{children}</body>
          </VideoProvider>
        </AuthProvider>
      </SessionWarper>
    </html>
  );
}
