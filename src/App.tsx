
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
import { UpdatePhone } from "./components/profile/UpdatePhone";
import { PullToRefresh } from "./components/ui/pull-to-refresh";
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PromoCode from "./pages/PromoCode";
import Wallet from "./pages/Wallet";
import SearchResults from "./pages/SearchResults";
import Gift from "./pages/Gift";
import GiftV2 from "./pages/GiftV2";
import MyGifts from "./pages/MyGifts";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import CollectGift from "./pages/CollectGift";
import Contacts from "./pages/Contacts";
import SelectRecipient from "./pages/SelectRecipient";
import AddMessage from "./pages/AddMessage";
import AddMemories from "./pages/AddMemories";
import SelectAmount from "./pages/SelectAmount";
import PreviewGift from "./pages/PreviewGift";
import PaymentSuccess from "./pages/PaymentSuccess";
import { FrontCard } from "./pages/FrontCard";
import InsideLeftCard from "./pages/InsideLeftCard";
import InsideRightCard from "./pages/InsideRightCard";
import PreviewAnimation from "./pages/PreviewAnimation";
import RecipientGift from "./pages/RecipientGift";
import CollectSignup from "./pages/CollectSignup";
import AppDownload from "./pages/AppDownload";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DarkModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <PullToRefresh />
              <Routes>
                <Route path="/" element={<Navigate to="/wallet" replace />} />
                <Route path="/download-app" element={<AppDownload />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/verify" element={<PhoneVerification />} />
                <Route path="/verify-code" element={<CodeVerification />} />
                <Route path="/setup" element={<AccountSetup />} />
                <Route path="/update-phone" element={<UpdatePhone />} />
                <Route path="/previewanimation" element={<PreviewAnimation />} />
                <Route path="/gifttoken" element={<RecipientGift />} />
                <Route path="/collect-signup" element={<CollectSignup />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                
                <Route path="/promo" element={<RequireAuth><PromoCode /></RequireAuth>} />
                <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
                <Route path="/search" element={<RequireAuth><SearchResults /></RequireAuth>} />
                <Route path="/gift" element={<RequireAuth><Gift /></RequireAuth>} />
                <Route path="/gift-v2" element={<RequireAuth><GiftV2 /></RequireAuth>} />
                <Route path="/frontcard" element={<RequireAuth><FrontCard /></RequireAuth>} />
                <Route path="/insideleftcard" element={<RequireAuth><InsideLeftCard /></RequireAuth>} />
                <Route path="/insiderightcard" element={<RequireAuth><InsideRightCard /></RequireAuth>} />
                <Route path="/select-recipient" element={<RequireAuth><SelectRecipient /></RequireAuth>} />
                <Route path="/add-message" element={<RequireAuth><AddMessage /></RequireAuth>} />
                <Route path="/add-memories" element={<RequireAuth><AddMemories /></RequireAuth>} />
                <Route path="/select-amount" element={<RequireAuth><SelectAmount /></RequireAuth>} />
                <Route path="/preview-gift" element={<RequireAuth><PreviewGift /></RequireAuth>} />
                <Route path="/my-gifts" element={<RequireAuth><MyGifts /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
                <Route path="/collect/:giftId" element={<RequireAuth><CollectGift /></RequireAuth>} />
                <Route path="/contacts" element={<RequireAuth><Contacts /></RequireAuth>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </DarkModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
