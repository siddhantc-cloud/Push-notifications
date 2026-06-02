import { GoogleGenAI, Type } from "@google/genai";
import { GenerateParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNotifications = async (params: GenerateParams) => {
  const { date, category, count, tone, topic, occasion } = params;

  // Determining temporal context
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const isNewYear = date.endsWith('-01-01');
  const isMonday = dayName === 'Monday';
  const isWeekend = ['Saturday', 'Sunday'].includes(dayName);

  const prompt = `
    You are a world-class growth copywriter for ZebPay, specializing in crypto futures trading signals.
    Task: Generate ${count} unique push notifications for ${date} (${dayName}).
    
    Current Context:
    - Target Segment: ${category}
    - Requested Tone: ${tone}
    - Specific Topic/Trend: ${topic}
    ${occasion ? `- Special Occasion: ${occasion}` : ''}
    ${isNewYear ? "- Special Event: New Year's Day. Focus on new beginnings and 2024/2025 trading goals." : ""}
    ${isMonday ? "- Day Context: Monday. Focus on weekly outlooks and starting strong." : ""}
    ${isWeekend ? "- Day Context: Weekend. Focus on tracking moves while markets are volatile/others are resting." : ""}

    STRICT BRANDING GUIDELINES:
    1. Branding: Use "ZebPay Power Trades" or "ZebPay Signal Group".
    2. Tone: Match the style of the provided reference list exactly (short, punchy, emoji-led).
    3. CTA: Must end with an action like "Join Now", "Click to Join", "Tap to Join", or "Join ZebPay Power Trades".
    4. Structure: 
       - Title: Start with ONE relevant emoji. Max 40 chars.
       - Body: 1-2 punchy sentences. Max 100 chars.
    
    REFERENCE EXAMPLES (MIMIC THIS STYLE):
    - "🚨 Live trades, shared daily. Join our Telegram group & start tracking real Futures calls today. Join Now"
    - "🚦 Your trading GPS is here. Navigate the markets with Futures signals on Telegram. Click to Join"
    - "🕵️ See what you’ve been missing. The most profitable trades are happening in Futures. Join our Telegram"
    - "⏳ Been a while since your last Futures trade. The first few calls landed well, time to trade? Join ZebPay Power Trades."
    - "🛡️ Spot ➜ Futures (safely). Convert small amounts to try our trading signals. Join ZebPay Power Trades"
    - "📲 Don't Analyze. Just Copy. Get exact Entry, Stop Loss, and Take Profit levels sent to your phone."
    - "🎩 For our most active traders. Get clean, actionable Futures calls on ZebPay Power Trades. Tap to Join"
    - "🔥 The market never sleeps. Stay on top with real-time Futures updates. Click to Join"

    TIME SLOTS: Suggest realistic windows like "5:00 - 6:00 PM", "12:00 - 1:00 PM", or "9:00 - 10:00 PM" based on peak crypto activity.

    Generate the output in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING },
              timeSlot: { type: Type.STRING }
            },
            required: ["title", "body", "timeSlot"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating notifications:", error);
    throw error;
  }
};
