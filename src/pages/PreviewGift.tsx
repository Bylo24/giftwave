
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PreviewStep } from "@/components/gift/PreviewStep";

const PreviewGiftContent = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // Handle payment flow later
    console.log("Proceeding to payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <PreviewStep 
          theme="birthday"
          phoneNumber=""
          amount=""
          messageVideo={null}
          memory={{
            caption: "",
            date: new Date()
          }}
          memories={[]}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

const PreviewGift = () => {
  return (
    <ThemeProvider>
      <PreviewGiftContent />
    </ThemeProvider>
  );
};

export default PreviewGift;
