import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center space-y-4 max-w-sm sm:max-w-md">
          <h2 className="text-3xl sm:text-4xl font-banter font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Banter AI
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Banter protocol online. Awaiting chaos.
          </p>
          <div className="text-xs text-muted-foreground/60 max-w-md mx-auto mt-4 p-3 bg-muted/20 rounded-lg border border-muted/30">
            <p className="font-medium mb-1">⚠️ AI Disclaimer</p>
            <p>This AI may provide inaccurate, biased, or inappropriate responses. Use at your own discretion.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6 max-w-4xl">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 sm:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[80%] overflow-hidden ${message.role === "user"
                ? "text-primary"
                : "text-foreground"
                }`}
            >
              <div className={`text-sm sm:text-base leading-loose prose prose-sm max-w-none break-words ${message.role === "user"
                ? "prose-invert prose-p:text-primary prose-a:text-primary underline-offset-4 prose-p:mb-4 prose-ul:my-4 prose-li:my-2 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-primary prose-ul:ml-4 prose-ol:ml-4"
                : "dark:prose-invert prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-p:mb-6 prose-ul:my-6 prose-li:mb-3 prose-headings:mb-6 prose-headings:mt-12 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-foreground prose-ul:ml-4 prose-ol:ml-4"
                }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 sm:gap-4 justify-start">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
            </div>
            <div className="max-w-[85%] sm:max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">Brain is Braining...</span>
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
