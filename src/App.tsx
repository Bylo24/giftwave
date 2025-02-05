import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { PhoneVerification } from "./components/auth/PhoneVerification";
import { CodeVerification } from "./components/auth/CodeVerification";
import { AccountSetup } from "./components/auth/AccountSetup";
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
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/verify" element={<PhoneVerification />} />
              <Route path="/verify-code" element={<CodeVerification />} />
              <Route path="/setup" element={<AccountSetup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/promo" element={<PromoCode />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/gift" element={<Gift />} />
              <Route path="/my-gifts" element={<MyGifts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/collect/:giftId" element={<CollectGift />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;