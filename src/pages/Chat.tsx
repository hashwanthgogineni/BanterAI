import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { logout } from "@/integrations/firebase/auth";
import { 
  queryDeepSeek, 
  generateLocalResponse, 
  saveUserPrompt, 
  saveChatMessage,
  getRecentChatHistory,
  ChatMessage 
} from "@/services/chatService";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useToast } from "@/hooks/use-toast";

// Use the ChatMessage interface from chatService
export type Message = ChatMessage;

const Chat = () => {
  // Remove authentication completely - no auth hooks
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Optional: Load chat history if user is authenticated (keeping auth code intact)
  useEffect(() => {
    if (user) {
      // Load recent chat history when user is authenticated
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const history = await getRecentChatHistory(user.uid, 20);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      userId: user?.uid || "anonymous",
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    
    // Save user prompt for learning (only if user is authenticated)
    if (user) {
      await saveUserPrompt(user.uid, content.trim());
      // Save user message to Firestore
      await saveChatMessage(user.uid, userMessage);
    }
    
    setLoading(true);

    try {
      // Query DeepSeek API for witty response
      const reply = await queryDeepSeek(content.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
        userId: user?.uid || "anonymous",
      };

      // Add assistant message to UI
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save assistant message to Firestore (only if user is authenticated)
      if (user) {
        await saveChatMessage(user.uid, assistantMessage);
      }
      
    } catch (error: any) {
      console.error("DeepSeek call failed:", error);
      
      // Fallback to local response
      const fallbackReply = generateLocalResponse(content.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackReply,
        timestamp: new Date(),
        userId: user?.uid || "anonymous",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      // Save assistant message to Firestore (only if user is authenticated)
      if (user) {
        await saveChatMessage(user.uid, assistantMessage);
      }
      
      toast({
        title: "Connection Issue",
        description: "Using offline mode - my wit is still sharp! 😏",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  // No authentication blocking - always show the chat interface

  return (
    <div className="flex flex-col h-screen mobile-chat-container">
      <ChatHeader 
        onLogout={handleLogout} 
        onLogin={handleLogin}
        userEmail={null} 
        isAuthenticated={false}
      />
      
      <div className="flex-1 overflow-hidden">
        <ChatMessages messages={messages} loading={loading} />
      </div>

      <div className="flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default Chat;
