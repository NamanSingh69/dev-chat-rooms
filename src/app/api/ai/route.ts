import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const { apiKey, messages, currentRoom } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: "API key is required" }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const models = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

        const contextPrompt = `You are an expert developer assistant inside a collaborative room called '${currentRoom}'.
Recent context:
${(messages || []).slice(-10).map((m: any) => `${m.sender}: ${m.text}`).join('\n')}

Based on the above, please provide a highly robust technical answer or bug fix. Give clear code examples formatted with markdown. Target the user's immediate question.`;

        for (const model of models) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: contextPrompt,
                });
                return NextResponse.json({ text: response.text, model });
            } catch (error: any) {
                if (error?.status === 429 || error?.message?.includes("429")) {
                    continue;
                }
                throw error;
            }
        }

        return NextResponse.json({ error: "All AI models are rate-limited." }, { status: 429 });
    } catch (error: any) {
        console.error("AI API Error:", error);
        return NextResponse.json(
            { error: error.message || "AI request failed" },
            { status: 500 }
        );
    }
}
