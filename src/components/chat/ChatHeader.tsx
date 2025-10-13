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
    <header className="border-b border-border bg-card/50 backdrop-blur-sm safe-area-pt">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-banter font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Banter AI
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated && userEmail && (
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={isAuthenticated ? onLogout : onLogin}
            className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Sign out</span>
              </>
            ) : (
              <>
                <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Login</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
