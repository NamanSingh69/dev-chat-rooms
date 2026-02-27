"use client";

import { useChat } from "./ChatContext";
import { Hash, Settings, Users, Code2, Link as LinkIcon, Check, Layout } from "lucide-react";
import { useState } from "react";

const ROOMS = [
    { id: "general", name: "General" },
    { id: "frontend", name: "Frontend Issues" },
    { id: "backend", name: "Backend APIs" },
    { id: "ai-help", name: "AI Assistance" },
];

export default function Sidebar() {
    const { currentRoom, setCurrentRoom, setIsSettingsOpen } = useChat();
    const [copied, setCopied] = useState(false);

    const handleCopyInvite = () => {
        const url = `${window.location.origin}?room=${currentRoom}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <aside className="w-full md:w-64 glass flex flex-col md:h-full shrink-0 border-b md:border-b-0 md:border-r border-white/5 z-20">
            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                        <Code2 size={20} className="text-white" />
                    </div>
                    <h1 className="font-bold text-base md:text-lg text-glow tracking-tight leading-tight hidden md:block">Dev Chat<br /><span className="text-primary font-normal text-sm">Rooms</span></h1>
                </div>

                {/* Mobile quick actions */}
                <div className="flex md:hidden gap-2">
                    <button onClick={handleCopyInvite} className="p-2 text-emerald-400 bg-emerald-500/10 rounded-lg">
                        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                    </button>
                    <a href="/design" target="_blank" className="p-2 text-primary bg-primary/10 rounded-lg">
                        <Layout size={16} />
                    </a>
                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-text-muted hover:text-white bg-white/5 rounded-lg">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            <div className="p-2 md:p-4 flex-none md:flex-1 overflow-x-auto md:overflow-y-auto">
                <div className="hidden md:flex text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 px-2 items-center justify-between">
                    <span>Rooms</span>
                    <Users size={14} />
                </div>

                <ul className="flex md:flex-col gap-2 md:space-y-1 w-max md:w-full">
                    {ROOMS.map(room => (
                        <li key={room.id}>
                            <button
                                onClick={() => setCurrentRoom(room.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-lg transition-all text-xs md:text-sm font-medium whitespace-nowrap ${currentRoom === room.id
                                    ? "bg-primary/20 text-white border border-primary/30"
                                    : "text-text-muted hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Hash size={14} className={currentRoom === room.id ? "text-primary" : "text-text-muted"} />
                                {room.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="hidden md:block p-4 border-t border-white/5 space-y-2">
                <button
                    onClick={handleCopyInvite}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                    {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                    {copied ? "Copied!" : "Copy Invite Link"}
                </button>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-white/5 hover:text-white transition-all"
                >
                    <Settings size={18} />
                    Settings
                </button>
                <a
                    href="/design"
                    target="_blank"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-left mt-2 block"
                >
                    <Layout size={18} className="inline-block mr-3" />
                    Design System
                </a>
            </div>
        </aside>
    );
}
