import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { GoogleGenAI } from "@google/genai";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Mock memory for context
const roomContexts: Record<string, any[]> = {};
const onlineUsers: Record<string, { username: string, room: string }> = {};

async function fallbackGeminiCall(apiKey: string, prompt: string) {
    const ai = new GoogleGenAI({ apiKey });
    const models = ["gemini-3-flash", "gemini-2.5-pro", "gemini-2.5-flash"];

    for (const model of models) {
        try {
            console.log(`[AI] Attempting ${model}...`);
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            });
            console.log(`[AI] Success with ${model}`);
            return response.text;
        } catch (error: any) {
            if (error?.status === 429 || error?.message?.includes("429")) {
                console.log(`[AI] Rate limit hit on ${model}. Falling back...`);
                continue; // Try next model
            } else if (model === models[models.length - 1] || error?.message?.includes("API key")) {
                // Not a rate limit, or we ran out of models
                throw error;
            }
        }
    }
    throw new Error("All AI models failed due to rate limits.");
}

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url || "", true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    });

    const io = new Server(httpServer, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        let currentRoom = "general";

        socket.on("join-room", ({ room, username }) => {
            if (currentRoom) {
                socket.leave(currentRoom);
                io.to(currentRoom).emit("user-left", { username });
            }
            currentRoom = room;
            socket.join(room);
            onlineUsers[socket.id] = { username, room };

            if (!roomContexts[room]) roomContexts[room] = [];

            // Broadcast join
            io.to(room).emit("user-joined", { username });

            // Send online count to room
            const roomUsers = Object.values(onlineUsers).filter(u => u.room === room);
            io.to(room).emit("room-users", roomUsers);
        });

        socket.on("typing", ({ username, isTyping }) => {
            socket.to(currentRoom).emit("user-typing", { username, isTyping });
        });

        socket.on("send-message", async (data) => {
            // Broadcast to room immediately
            io.to(currentRoom).emit("receive-message", data);

            // Save to context
            if (!roomContexts[currentRoom]) roomContexts[currentRoom] = [];
            roomContexts[currentRoom].push(data);
            if (roomContexts[currentRoom].length > 10) roomContexts[currentRoom].shift();

            // Check if AI was mentioned
            if (data.text.includes("@AI") || data.text.includes("```")) {
                if (!data.apiKey) {
                    io.to(currentRoom).emit("receive-message", {
                        id: Date.now().toString(),
                        sender: "System",
                        text: "Please set your Gemini API key in settings to use the AI assistant.",
                        isAi: true,
                        timestamp: new Date()
                    });
                    return;
                }

                try {
                    const contextPrompt = `You are an expert developer assistant inside a collaborative room called '${currentRoom}'.
Recent context:
${roomContexts[currentRoom].map(m => `${m.sender}: ${m.text}`).join('\n')}

Based on the above, please provide a highly robust technical answer or bug fix. Give clear code examples formatted with markdown. Target the user's immediate question.`;

                    const aiResponse = await fallbackGeminiCall(data.apiKey, contextPrompt);

                    const aiMessage = {
                        id: Date.now().toString(),
                        sender: "Gemini",
                        text: aiResponse || "I couldn't generate a response.",
                        isAi: true,
                        timestamp: new Date()
                    };

                    roomContexts[currentRoom].push(aiMessage);
                    io.to(currentRoom).emit("receive-message", aiMessage);
                } catch (error: any) {
                    console.error("AI Error:", error);
                    io.to(currentRoom).emit("receive-message", {
                        id: Date.now().toString(),
                        sender: "System",
                        text: `AI Request Failed: ${error.message}`,
                        isAi: true,
                        timestamp: new Date()
                    });
                }
            }
        });

        socket.on("disconnect", () => {
            const user = onlineUsers[socket.id];
            if (user) {
                io.to(user.room).emit("user-left", { username: user.username });
                delete onlineUsers[socket.id];
                const roomUsers = Object.values(onlineUsers).filter(u => u.room === user.room);
                io.to(user.room).emit("room-users", roomUsers);
            }
            console.log("User disconnected:", socket.id);
        });
    });

    httpServer.once("error", (err) => {
        console.error(err);
        process.exit(1);
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
