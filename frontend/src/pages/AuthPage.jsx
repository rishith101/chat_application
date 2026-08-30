import { useState } from "react";
import { SignIn, SignUp } from "@clerk/react";
import { MessageSquare, Sparkles, ShieldCheck, Zap, Volume2 } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("signIn"); // "signIn" | "signUp"

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Left Hero Branding Banner */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 via-accent/5 to-background border-r border-border/30 relative">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">VibeChat</h1>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl font-bold leading-tight">
                Connect seamlessly with real-time audio feedback.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Experience instant messaging, online presence indicators, media sharing, and customizable mechanical typing sounds.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs font-medium text-foreground">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Secure Authentication & Privacy</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-foreground">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Instant Socket.IO Real-time Messaging</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-foreground">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Volume2 className="w-4 h-4" />
                </div>
                <span>Customizable Mechanical Typing Audio</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/30 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Built for speed, clarity, and modern team chat.</span>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="p-6 sm:p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm space-y-6">
            {/* Mobile Header */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">VibeChat</span>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-muted/50 border border-border/40 text-xs font-semibold">
              <button
                onClick={() => setMode("signIn")}
                className={`py-2.5 rounded-xl transition ${
                  mode === "signIn"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signUp")}
                className={`py-2.5 rounded-xl transition ${
                  mode === "signUp"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Clerk Sign In / Sign Up View */}
            <div className="flex justify-center">
              {mode === "signIn" ? (
                <SignIn
                  routing="hash"
                  signUpUrl="#"
                  appearance={{
                    elements: {
                      card: "shadow-none bg-transparent p-0 w-full",
                      headerTitle: "text-foreground text-lg font-bold",
                      headerSubtitle: "text-muted-foreground text-xs",
                      formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold py-2.5 rounded-xl shadow-xs",
                      formFieldInput: "bg-muted/40 border-border/50 text-foreground text-xs rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary/30",
                      footerActionLink: "text-primary font-medium hover:underline text-xs",
                    },
                  }}
                />
              ) : (
                <SignUp
                  routing="hash"
                  signInUrl="#"
                  appearance={{
                    elements: {
                      card: "shadow-none bg-transparent p-0 w-full",
                      headerTitle: "text-foreground text-lg font-bold",
                      headerSubtitle: "text-muted-foreground text-xs",
                      formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold py-2.5 rounded-xl shadow-xs",
                      formFieldInput: "bg-muted/40 border-border/50 text-foreground text-xs rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary/30",
                      footerActionLink: "text-primary font-medium hover:underline text-xs",
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
