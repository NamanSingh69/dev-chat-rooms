"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "./ChatContext";
import { Send, Bot, User, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

import { io, Socket } from "socket.io-client";

interface Message {
    id: string;
    sender: string;
    text: string;
    isAi: boolean;
    timestamp: Date;
    apiKey?: string;
}

let socket: Socket | null = null;

export default function ChatWindow() {
    const { currentRoom, username, apiKey, setIsSettingsOpen } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [onlineCount, setOnlineCount] = useState(1);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    // Try to connect socket — works locally, gracefully fails on Vercel
    useEffect(() => {
        try {
            socket = io({ path: "/socket.io", transports: ["websocket", "polling"] });

            socket.on("connect", () => {
                setSocketConnected(true);
            });

            socket.on("connect_error", () => {
                setSocketConnected(false);
                socket?.disconnect();
                socket = null;
            });

            socket.on("receive-message", (msg: Message) => {
                setMessages((prev) => [...prev, { ...msg, timestamp: new Date(msg.timestamp) }]);
            });

            socket.on("room-history", (history: Message[]) => {
                setMessages(prev => {
                    const initMsg = prev.find(p => p.id === "system-init");
                    const parsedHistory = history.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
                    return initMsg ? [initMsg, ...parsedHistory] : parsedHistory;
                });
            });

            socket.on("room-users", (users: any[]) => {
                setOnlineCount(users.length);
            });

            socket.on("user-typing", ({ username: typingUser, isTyping }: { username: string, isTyping: boolean }) => {
                setTypingUsers(prev => {
                    if (isTyping && !prev.includes(typingUser)) return [...prev, typingUser];
                    if (!isTyping) return prev.filter(u => u !== typingUser);
                    return prev;
                });
            });
        } catch {
            setSocketConnected(false);
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (username) {
            if (socket && socketConnected) {
                socket.emit("join-room", { room: currentRoom, username });
            }
            setMessages([
                {
                    id: "system-init",
                    sender: "System",
                    text: `Joined **${currentRoom}** room. Tag @LowEntropyAI or paste code with \`\`\` to get instant AI help.`,
                    isAi: true,
                    timestamp: new Date()
                }
            ]);
            setTypingUsers([]);
        }
    }, [currentRoom, username, socketConnected]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (socket && socketConnected && username) {
            socket.emit("typing", { username, isTyping: true });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket?.emit("typing", { username, isTyping: false });
            }, 2000);
        }
    };

    // Fallback AI call via API route (works on Vercel)
    const callAiViaApi = async (allMessages: Message[]) => {
        setIsAiLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apiKey,
                    messages: allMessages.map(m => ({ sender: m.sender, text: m.text })),
                    currentRoom,
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const aiMessage: Message = {
                id: Date.now().toString(),
                sender: "LowEntropyAI",
                text: data.text || "I couldn't generate a response.",
                isAi: true,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            let errorMsg = error.message;
            if (errorMsg.includes("{")) {
                try {
                    const parsed = JSON.parse(errorMsg.substring(errorMsg.indexOf("{")));
                    if (parsed.error?.message) errorMsg = parsed.error.message;
                } catch { }
            }

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: "System",
                text: `AI Request Failed: ${errorMsg}`,
                isAi: true,
                timestamp: new Date(),
            }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !username) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: username,
            text: input,
            isAi: false,
            timestamp: new Date(),
            apiKey: apiKey || undefined
        };

        if (socket && socketConnected) {
            // Socket.IO mode (local dev) — server handles AI
            socket.emit("send-message", newMessage);
            socket.emit("typing", { username, isTyping: false });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        } else {
            // API route mode (Vercel) — client handles display + AI call
            setMessages(prev => [...prev, newMessage]);

            const needsAi = input.includes("@LowEntropyAI") || input.includes("@AI") || input.includes("```");
            if (needsAi && apiKey) {
                await callAiViaApi([...messages, newMessage]);
            } else if (needsAi && !apiKey) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    sender: "System",
                    text: "Please set your Gemini API key in settings to use the AI assistant.",
                    isAi: true,
                    timestamp: new Date(),
                }]);
            }
        }
        setInput("");
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            <header className="px-4 py-3 md:px-6 md:py-4 glass border-b border-white/5 flex items-center justify-between sticky top-0 z-10 shrink-0">
                <div>
                    <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                        <span className="text-primary text-xl">#</span>
                        {currentRoom === "general" ? "General" :
                            currentRoom === "frontend" ? "Frontend Issues" :
                                currentRoom === "backend" ? "Backend APIs" : "AI Assistance"}
                    </h2>
                    <p className="text-xs md:text-sm text-text-muted mt-0.5 md:mt-1">Real-time collaboration room with AI support</p>
                </div>
                <div className="flex -space-x-2 items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-surface bg-green-500 flex items-center justify-center relative">
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border border-surface rounded-full"></div>
                        <User size={14} className="text-white" />
                    </div>
                    {onlineCount > 1 && (
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-purple-500 flex items-center justify-center text-xs font-bold shadow-lg">
                            +{onlineCount - 1}
                        </div>
                    )}
                    {!socketConnected && (
                        <span className="ml-3 text-xs text-yellow-400/80 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">API Mode</span>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 max-w-4xl ${msg.sender === username ? "ml-auto flex-row-reverse" : ""}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "System" ? "bg-gray-700" :
                            msg.isAi ? "bg-ai text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-ai/50" :
                                msg.sender === username ? "bg-primary" : "bg-purple-600"
                            }`}>
                            {msg.isAi ? <Bot size={20} /> : <User size={20} />}
                        </div>

                        <div className={`flex flex-col ${msg.sender === username ? "items-end" : "items-start"} min-w-[200px]`}>
                            <div className="flex items-baseline gap-2 mb-1 px-1">
                                <span className="font-semibold text-sm">{msg.sender === username ? "You" : msg.sender}</span>
                                <span className="text-xs text-text-muted">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.isAi && <span className="text-[10px] bg-ai/20 text-ai px-1.5 py-0.5 rounded ml-2 border border-ai/20">AI Support</span>}
                            </div>

                            <div className={`p-4 rounded-2xl ${msg.sender === username ? "bg-primary text-white rounded-tr-sm" :
                                msg.isAi ? "glass-panel border-ai/20 rounded-tl-sm w-full" : "glass-panel rounded-tl-sm w-full"
                                }`}>
                                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <div className="mt-2 mb-2 rounded-lg overflow-hidden border border-white/10 shadow-xl">
                                                        <SyntaxHighlighter
                                                            style={tomorrow as any}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{ margin: 0, padding: '1rem', background: '#0f1115' }}
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm text-primary-hover font-mono" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isAiLoading && (
                    <div className="flex gap-4 max-w-4xl">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-ai text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-ai/50">
                            <Bot size={20} />
                        </div>
                        <div className="glass-panel border-ai/20 rounded-2xl rounded-tl-sm p-4">
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-ai rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-ai rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 bg-ai rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                                <span>LowEntropyAI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-text-muted text-sm ml-14 animate-pulse">
                        <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                        <span>{typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...</span>
                    </div>
                )}

                <div ref={endOfMessagesRef} />
            </div>

            <div className="p-3 md:p-4 glass border-t border-white/5 mx-2 md:mx-4 mb-2 md:mb-4 rounded-2xl shadow-xl flex items-center gap-2 transition-all">
                {!username ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-2 text-center">
                        <p className="text-text-muted text-sm mb-3">You must be logged in and set an API key to access this room.</p>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                            Kindly login to access
                        </button>
                    </div>
                ) : (
                    <>
                        <button className="p-2 text-text-muted hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10">
                            <Code2 size={20} />
                        </button>
                        <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={handleTyping}
                                placeholder="Message the room or tag @LowEntropyAI for instant code help..."
                                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-white/40 py-2 h-full"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] group"
                            >
                                <Send size={18} className="translate-x-[-1px] group-hover:translate-x-[1px] transition-transform" />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
