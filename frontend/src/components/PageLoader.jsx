import { Loader2, MessageSquare } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-xl">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="w-8 h-8 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Loading chat workspace...</span>
        </div>
      </div>
    </div>
  );
}
