"use client";

import { useChat } from "./ChatContext";
import { Hash, Settings, Users, Code2, Link as LinkIcon, Check } from "lucide-react";
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
        <aside className="w-64 glass flex flex-col h-full border-r border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Code2 size={24} className="text-white" />
                </div>
                <h1 className="font-bold text-lg text-glow tracking-tight leading-tight">Dev Chat<br /><span className="text-primary font-normal text-sm">Rooms</span></h1>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center justify-between">
                    <span>Rooms</span>
                    <Users size={14} />
                </div>

                <ul className="space-y-1">
                    {ROOMS.map(room => (
                        <li key={room.id}>
                            <button
                                onClick={() => setCurrentRoom(room.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${currentRoom === room.id
                                    ? "bg-primary/20 text-white border border-primary/30"
                                    : "text-text-muted hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Hash size={16} className={currentRoom === room.id ? "text-primary" : "text-text-muted"} />
                                {room.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-white/5 space-y-2">
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
            </div>
        </aside>
    );
}
