
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { GiftPreviewAnimation } from "@/components/gift/GiftPreviewAnimation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TestAnimation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Sample test data
  const testMemories = [
    {
      id: "1",
      imageUrl: "/placeholder.svg",
      caption: "Memory 1",
      date: new Date()
    },
    {
      id: "2",
      imageUrl: "/placeholder.svg",
      caption: "Memory 2",
      date: new Date()
    }
  ];

  const handleComplete = () => {
    setIsPlaying(false);
    console.log("Animation completed!");
  };

  return (
    <PageContainer>
      <PageHeader title="Animation Test" />
      <div className="p-4">
        {!isPlaying ? (
          <div className="space-y-4 text-center">
            <Button 
              onClick={() => setIsPlaying(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              Play Animation
            </Button>
          </div>
        ) : (
          <GiftPreviewAnimation
            messageVideo={null}
            amount="50"
            memories={testMemories}
            onComplete={handleComplete}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default TestAnimation;
