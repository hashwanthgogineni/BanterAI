import { LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onLogout: () => void;
  onLogin: () => void;
  userEmail?: string | null;
  isAuthenticated: boolean;
}

const ChatHeader = ({ onLogout, onLogin, userEmail, isAuthenticated }: ChatHeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-banter font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Banter AI
          </h1>
          {/* <span className="text-sm text-muted-foreground hidden md:inline">
            ✨ Witty & Sarcastic
          </span> */}
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && userEmail && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={isAuthenticated ? onLogout : onLogin}
            className="gap-2"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
