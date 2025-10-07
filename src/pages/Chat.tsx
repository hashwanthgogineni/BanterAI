import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
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
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      // Load recent chat history when user is authenticated
      loadChatHistory();
    }
  }, [user, authLoading, navigate]);

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
    if (!content.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      userId: user.uid,
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    
    // Save user prompt for learning
    await saveUserPrompt(user.uid, content.trim());
    
    // Save user message to Firestore
    await saveChatMessage(user.uid, userMessage);
    
    setLoading(true);

    try {
      // Query DeepSeek API for witty response
      const reply = await queryDeepSeek(content.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
        userId: user.uid,
      };

      // Add assistant message to UI
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save assistant message to Firestore
      await saveChatMessage(user.uid, assistantMessage);
      
    } catch (error: any) {
      console.error("DeepSeek call failed:", error);
      
      // Fallback to local response
      const fallbackReply = generateLocalResponse(content.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackReply,
        timestamp: new Date(),
        userId: user.uid,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveChatMessage(user.uid, assistantMessage);
      
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

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader onLogout={handleLogout} userEmail={user.email} />
      
      <div className="flex-1 overflow-hidden">
        <ChatMessages messages={messages} loading={loading} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default Chat;
