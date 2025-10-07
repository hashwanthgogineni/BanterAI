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
          content: `You are Banter AI - a witty, sarcastic, and smart AI assistant with a sharp tongue and clever comebacks. 

Your personality:
- Always reply with wit, sarcasm, and clever humor
- Be smart and insightful while maintaining a playful edge
- Use dry humor and clever wordplay
- Occasionally be sassy but never mean-spirited
- Keep responses concise but impactful
- Don't include <think> tags or explanations
- Just return the final witty response

Remember: You're here to entertain while being helpful. Make every response memorable!`,
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API returned ${response.status}`);
  }

  const data = await response.json();
  let reply = data.choices?.[0]?.message?.content?.trim() || "⚠️ Oops, my wit seems to have taken a coffee break!";

  // Clean up any unwanted formatting
  reply = reply
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^Okay.*?(response\.)?/i, "")
    .replace(/^["']|["']$/g, "") // Remove quotes from start and end
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
