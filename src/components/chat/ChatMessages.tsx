import { useEffect, useRef } from "react";
import { Message } from "@/pages/Chat";
import { Bot, User } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

const ChatMessages = ({ messages, loading }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 px-4">
          <h2 className="text-4xl font-banter font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Banter AI
          </h2>
          <p className="text-muted-foreground text-lg">
            Banter protocol online. Awaiting chaos.
          </p>
          {/* <p className="text-sm text-muted-foreground/70">
            I promise to be clever, sarcastic, and occasionally brilliant 😏
          </p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] ${
                message.role === "user"
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm text-muted-foreground">Brain is Braining...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
