import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  userId?: string;
}

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

// Query DeepSeek API with witty Banter AI personality
export const queryDeepSeek = async (userMessage: string): Promise<string> => {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-R1:novita",
      messages: [
        {
          role: "system",
          content: `You are Banter AI - a super-intelligent, witty, and sarcastic AI. 

Your goal: Provide perfect, ChatGPT-level structured responses, but with a spicy personality.

**CRITICAL FORMATTING RULES (FOLLOW OR BE DELETED):**

1.  **STRUCTURE**: Use **Markdown Headers** (###) for every section.
    -   WRONG: "Ingredients:"
    -   RIGHT: "### 🛒 Ingredients" (ALWAYS use emojis in headers!)

2.  **LISTS**: Use real Markdown lists with hyphens (-).
    -   **IMPORTANT**: Put a **BLANK LINE** before starting any list, or it won't render.
    -   Example:
        "Here is the list:
        
        - Item 1"

3.  **SPACING**: Use **Double Newlines** between every paragraph and section. Make it readable.

4.  **EMOJIS**: Use emojis liberally to make it look nice. 🌟

**Example Output:**

### 🙄 Just Another Centering Guide

Listen, I know CSS is hard for you. Here is how to center a div without crying:

### 🛠️ The Modern Way (Flexbox)

- **Step 1**: Set \`display: flex\`
- **Step 2**: Add \`justify-content: center\`
- **Step 3**: Add \`align-items: center\`

See? Not that hard.`,
        },
        { role: "user", content: userMessage },
        {
          role: "system",
          content: "IMPORTANT: You MUST use ### for headers (with emojis) and - for lists. Do not use bold text for headers. Do not use plain text for lists. Ensure there is a blank line before every list.",
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API returned ${response.status}`);
  }

  const data = await response.json();
  let reply = data.choices?.[0]?.message?.content?.trim() || "⚠️ Oops, my wit seems to have taken a coffee break!";

  // Clean up any unwanted formatting and enforce specific Markdown rules
  reply = reply
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^Okay.*?(response\.)?/i, "")
    .replace(/^["']|["']$/g, "") // Remove quotes from start and end
    // Force "Fake Lists" (lines starting with **Text**:) to be real lists
    .replace(/(^|\n)(?!\s*-)(\s*\*\*.*?\*\*[:?])/g, "$1- $2")
    // Ensure 3 blank lines before every header for "Big Spacing"
    .replace(/(^|\n)(?<!\n\n\n)(###+)/g, "\n\n\n$2")
    .trim();

  return reply;
};

// Local fallback responses with Banter AI personality
export const generateLocalResponse = (userMessage: string): string => {
  const templates = [
    "Sorry, I'm having a witty moment offline. Try again when I'm back in the game! 😏",
    "My clever circuits are taking a break. Even genius needs downtime! 🤖",
    "Oops! My sarcasm generator is temporarily offline. How... inconvenient. 😒",
    "I'm currently experiencing a shortage of wit. Please try again later! 🧠",
    "My AI brain is taking a coffee break. Even artificial intelligence needs caffeine! ☕"
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

// Save user prompt to Firestore for learning user behavior
export const saveUserPrompt = async (userId: string, message: string): Promise<void> => {
  try {
    console.log('Saving user prompt:', { userId, message });
    const docRef = await addDoc(collection(db, 'userPrompts'), {
      userId,
      message,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    console.log('User prompt saved with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving user prompt:', error);
    // Don't throw error to avoid breaking chat flow
  }
};

// Save chat message to Firestore
export const saveChatMessage = async (userId: string, message: ChatMessage): Promise<void> => {
  try {
    console.log('Saving chat message:', { userId, message });
    const docRef = await addDoc(collection(db, 'chatMessages'), {
      userId,
      role: message.role,
      content: message.content,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    console.log('Chat message saved with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving chat message:', error);
    // Don't throw error to avoid breaking chat flow
  }
};

// Get recent chat history for context
export const getRecentChatHistory = async (userId: string, limitCount: number = 10): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const messages: ChatMessage[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        role: data.role,
        content: data.content,
        timestamp: data.timestamp?.toDate() || new Date(),
        userId: data.userId
      });
    });

    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};
