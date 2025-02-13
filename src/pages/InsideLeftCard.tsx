
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { VideoStage } from "@/components/gift/stages/VideoStage";

const InsideLeftCardContent = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <div className="min-h-screen bg-black">
      {videoUrl && <VideoStage videoUrl={videoUrl} />}
    </div>
  );
};

const InsideLeftCard = () => {
  return (
    <ThemeProvider>
      <InsideLeftCardContent />
    </ThemeProvider>
  );
};

export default InsideLeftCard;
