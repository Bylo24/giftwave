
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MessageStep } from "@/components/gift/MessageStep";

const AddMessageContent = () => {
  const navigate = useNavigate();
  const [messageVideo, setMessageVideo] = useState<File | null>(null);

  const handleNext = () => {
    navigate('/add-memories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <MessageStep 
          isOpen={true}
          onClose={() => navigate(-1)}
          messageVideo={messageVideo}
          setMessageVideo={setMessageVideo}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

const AddMessage = () => {
  return (
    <ThemeProvider>
      <AddMessageContent />
    </ThemeProvider>
  );
};

export default AddMessage;
