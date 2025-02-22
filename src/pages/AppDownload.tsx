
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Gift, ArrowRight } from "lucide-react";

const AppDownload = () => {
  const navigate = useNavigate();
  const giftToken = sessionStorage.getItem('giftToken');

  useEffect(() => {
    if (!giftToken) {
      navigate('/');
    }
  }, [giftToken, navigate]);

  const handleSkip = () => {
    sessionStorage.removeItem('giftToken');
    navigate('/wallet');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Download GiftWave
          </h1>
          
          <p className="text-gray-600">
            Get the GiftWave app to access your wallet and send beautiful gifts to your loved ones
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <Button
              className="w-full bg-black text-white hover:bg-gray-900"
              onClick={() => window.open('https://apps.apple.com/app/giftwave', '_blank')}
            >
              Download on the App Store
            </Button>
            
            <Button
              className="w-full bg-black text-white hover:bg-gray-900"
              onClick={() => window.open('https://play.google.com/store/apps/details?id=app.giftwave', '_blank')}
            >
              Get it on Google Play
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/70 backdrop-blur-sm px-2 text-gray-500">
                  Or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-gray-600"
            >
              Continue on Web
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AppDownload;
