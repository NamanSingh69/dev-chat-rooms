import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface/80 via-background to-black">
      <Sidebar />
      <ChatWindow />
    </main>
  );
}
