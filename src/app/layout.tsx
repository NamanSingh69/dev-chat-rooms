import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/components/ChatContext";
import SettingsModal from "@/components/SettingsModal";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dev Chat Rooms",
  description: "Real-time AI-powered dev chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            {children}
            <SettingsModal />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
