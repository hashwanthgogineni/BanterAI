import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Got questions? I've got attitude."
                disabled={disabled}
                className="min-h-[56px] max-h-[200px] resize-none pr-12 rounded-2xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border/50"
                rows={1}
              />
            </div>
            
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              disabled={!input.trim() || disabled}
              className="h-12 w-12 shrink-0 hover:bg-transparent"
            >
              <Send className="h-6 w-6 text-primary" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
