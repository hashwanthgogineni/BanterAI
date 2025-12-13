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
    <div className="bg-background border-t border-border/50 safe-area-pb">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Got questions? I've got attitude."
                disabled={disabled}
                className="min-h-[48px] sm:min-h-[56px] max-h-[120px] sm:max-h-[200px] resize-none pr-10 sm:pr-12 rounded-xl sm:rounded-2xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border/50 text-sm sm:text-base"
                rows={1}
              />
            </div>

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || disabled}
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Send className="h-5 w-5 sm:h-6 sm:w-6 text-black fill-black" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
