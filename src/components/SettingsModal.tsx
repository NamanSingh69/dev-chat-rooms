"use client";

import { useChat } from "./ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, User, ExternalLink, LogIn, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function SettingsModal() {
    const { isSettingsOpen, setIsSettingsOpen, apiKey, setApiKey, username, setUsername } = useChat();
    const { data: session } = useSession();

    if (!isSettingsOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-panel w-full max-w-md p-6 relative"
                >
                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="absolute top-4 right-4 p-1 text-text-muted hover:text-white transition-colors rounded-full hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-semibold mb-6 text-glow">Setup & Settings</h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1 flex items-center gap-2">
                                <User size={16} /> Authentication
                            </label>

                            {session ? (
                                <div className="flex items-center justify-between bg-surface/50 border border-white/10 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                        {session.user?.image && (
                                            <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-white">{session.user?.name}</p>
                                            <p className="text-xs text-text-muted">{session.user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => signIn("google")}
                                        className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 px-4 py-2.5 rounded-lg font-medium transition-all"
                                    >
                                        <LogIn size={18} /> Sign in with Google
                                    </button>
                                    <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-widest font-semibold">
                                        <div className="flex-1 h-px bg-white/10"></div>
                                        Or use anonymous name
                                        <div className="flex-1 h-px bg-white/10"></div>
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter display name"
                                        className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1 flex items-center gap-2">
                                <Key size={16} /> Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                            />
                            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                                Get your key from
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-hover flex items-center underline"
                                >
                                    Google AI Studio <ExternalLink size={12} className="ml-1" />
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            disabled={!(session || username.trim()) || !apiKey.trim()}
                            className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all transform active:scale-95"
                        >
                            Save & Continue
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
