import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, ArrowRight } from "lucide-react";
const AppDownload = () => {
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl text-center">
        <div className="space-y-4">
          <div className="">
            <img src="/lovable-uploads/0662fd11-2030-457c-97dd-b8529e27cfce.png" alt="GiftWave" className="h-10 w-10" onError={e => {
            e.currentTarget.onerror = null; // Prevent infinite loop
            e.currentTarget.style.display = 'none';
            // Show Smartphone icon as fallback
            const fallbackIcon = document.createElement('div');
            fallbackIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
            e.currentTarget.parentNode.appendChild(fallbackIcon.firstChild);
          }} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Download GiftWave
          </h1>
          
          <p className="text-gray-600">
            Get the GiftWave app to access your wallet and send beautiful gifts to your loved ones
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={() => window.open('https://apps.apple.com/app/giftwave', '_blank')}>
              Download on the App Store
            </Button>
            
            <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={() => window.open('https://play.google.com/store/apps/details?id=app.giftwave', '_blank')}>
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

            <Button variant="outline" onClick={() => window.location.href = '/wallet'} className="text-gray-600">
              Continue on Web
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>;
};
export default AppDownload;