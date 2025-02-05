import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { PhoneVerification } from "./components/auth/PhoneVerification";
import { CodeVerification } from "./components/auth/CodeVerification";
import { AccountSetup } from "./components/auth/AccountSetup";
import { RequireAuth } from "./components/auth/RequireAuth";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PromoCode from "./pages/PromoCode";
import Wallet from "./pages/Wallet";
import SearchResults from "./pages/SearchResults";
import Gift from "./pages/Gift";
import MyGifts from "./pages/MyGifts";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import CollectGift from "./pages/CollectGift";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/verify" element={<PhoneVerification />} />
              <Route path="/verify-code" element={<CodeVerification />} />
              <Route path="/setup" element={<AccountSetup />} />
              
              {/* Protected Routes */}
              <Route path="/promo" element={<RequireAuth><PromoCode /></RequireAuth>} />
              <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
              <Route path="/search" element={<RequireAuth><SearchResults /></RequireAuth>} />
              <Route path="/gift" element={<RequireAuth><Gift /></RequireAuth>} />
              <Route path="/my-gifts" element={<RequireAuth><MyGifts /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
              <Route path="/collect/:giftId" element={<RequireAuth><CollectGift /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;