import { ThemeProvider } from "./context/theme.jsx";
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/chatPage";
import AuthPage from "./pages/AuthPage";
import { useAuth, useUser } from "@clerk/react";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      checkAuth(clerkUser);
    } else {
      clearAuth();
    }
  }, [checkAuth, clearAuth, isLoaded, isSignedIn, clerkUser]);

  if (!isLoaded || (isSignedIn && isCheckingAuth)) {
    return <PageLoader />;
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={isSignedIn ? <ChatPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/auth/*"
          element={!isSignedIn ? <AuthPage /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </ThemeProvider>
  );
}

export default App;