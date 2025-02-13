
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AmountStep } from "@/components/gift/AmountStep";

const GiftV2Content = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const handleNext = () => {
    // We'll handle the next step later
    console.log("Selected amount:", amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="p-4">
        <button 
          onClick={() => navigate('/gift')}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <motion.div 
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-md mx-auto">
          <AmountStep 
            amount={amount}
            setAmount={setAmount}
            onNext={handleNext}
          />
        </div>
      </motion.div>
    </div>
  );
};

const GiftV2 = () => {
  return (
    <ThemeProvider>
      <GiftV2Content />
    </ThemeProvider>
  );
};

export default GiftV2;
