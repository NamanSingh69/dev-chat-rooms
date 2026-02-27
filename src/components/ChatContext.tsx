"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface ChatContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    username: string;
    setUsername: (name: string) => void;
    currentRoom: string;
    setCurrentRoom: (room: string) => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [apiKey, setApiKeyState] = useState("");
    const [username, setUsernameState] = useState("");
    const [currentRoom, setCurrentRoom] = useState("general");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        // Load from local storage
        const storedKey = localStorage.getItem("gemini_api_key");
        const storedName = localStorage.getItem("chat_username");

        if (storedKey) setApiKeyState(storedKey);

        if (session?.user?.name) {
            setUsernameState(session.user.name);
        } else if (storedName) {
            setUsernameState(storedName);
        }

        // Auto open settings if no name/session or key
        if (!storedKey || (!storedName && !session?.user?.name)) {
            setIsSettingsOpen(true);
        }
        setMounted(true);
    }, [session]);

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        localStorage.setItem("gemini_api_key", key);
    };

    const setUsername = (name: string) => {
        setUsernameState(name);
        localStorage.setItem("chat_username", name);
    };

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <ChatContext.Provider
            value={{
                apiKey,
                setApiKey,
                username,
                setUsername,
                currentRoom,
                setCurrentRoom,
                isSettingsOpen,
                setIsSettingsOpen,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
