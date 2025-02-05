import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { PhoneVerification } from "./components/auth/PhoneVerification";
import { CodeVerification } from "./components/auth/CodeVerification";
import { AccountSetup } from "./components/auth/AccountSetup";
import NotFound from "./pages/NotFound";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/verify" element={<PhoneVerification />} />
            <Route path="/verify-code" element={<CodeVerification />} />
            <Route path="/setup" element={<AccountSetup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;