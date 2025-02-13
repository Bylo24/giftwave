
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const GiftV2Content = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="p-4">
        <button 
          onClick={() => navigate(-1)}
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
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Send a Gift</h1>
          <p className="text-gray-600">
            Create a personalized digital gift card with your own memories and messages.
          </p>
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
