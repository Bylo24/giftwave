
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import AddMemories from "@/pages/AddMemories";
import AddMessage from "@/pages/AddMessage";
import FrontCard from "@/pages/FrontCard";
import Gift from "@/pages/Gift";
import GiftV2 from "@/pages/GiftV2";
import InsideLeftCard from "@/pages/InsideLeftCard";
import InsideLeftScreen from "@/pages/InsideLeftScreen";
import InsideRightCard from "@/pages/InsideRightCard";
import Preview from "@/pages/Preview";
import PreviewAnimation from "@/pages/PreviewAnimation";
import PreviewGift from "@/pages/PreviewGift";
import Profile from "@/pages/Profile";
import PromoCode from "@/pages/PromoCode";
import RecipientGift from "@/pages/RecipientGift";
import SearchResults from "@/pages/SearchResults";
import SelectAmount from "@/pages/SelectAmount";
import SelectRecipient from "@/pages/SelectRecipient";
import Wallet from "@/pages/Wallet";
import PaymentSuccess from "@/pages/PaymentSuccess";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-memories" element={<AddMemories />} />
            <Route path="/add-message" element={<AddMessage />} />
            <Route path="/frontcard" element={<FrontCard />} />
            <Route path="/gift" element={<Gift />} />
            <Route path="/gift-v2" element={<GiftV2 />} />
            <Route path="/inside-left" element={<InsideLeftCard />} />
            <Route path="/inside-left-screen" element={<InsideLeftScreen />} />
            <Route path="/inside-right" element={<InsideRightCard />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/preview-animation" element={<PreviewAnimation />} />
            <Route path="/preview-gift" element={<PreviewGift />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/promo-code" element={<PromoCode />} />
            <Route path="/recipient-gift" element={<RecipientGift />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/select-amount" element={<SelectAmount />} />
            <Route path="/select-recipient" element={<SelectRecipient />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Add redirect from /choose-person to /select-recipient */}
            <Route path="/choose-person" element={<Navigate to="/select-recipient" replace />} />
            
            {/* Catch all 404s and redirect to NotFound page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
