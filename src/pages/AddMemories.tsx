
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MemoryReplayScreen } from "@/components/gift/MemoryReplayScreen";

const AddMemoriesContent = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<Array<{ id: string; imageUrl?: string; caption: string; date: Date }>>([]);

  const handleAddMemory = (memory: Omit<{ id: string; imageUrl?: string; caption: string; date: Date }, "id">) => {
    const newMemory = {
      ...memory,
      id: crypto.randomUUID()
    };
    setMemories(prev => [...prev, newMemory]);
  };

  const handleNext = () => {
    navigate('/select-amount');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <MemoryReplayScreen
        memories={memories}
        onAddMemory={handleAddMemory}
        onNext={handleNext}
      />
    </div>
  );
};

const AddMemories = () => {
  return (
    <ThemeProvider>
      <AddMemoriesContent />
    </ThemeProvider>
  );
};

export default AddMemories;
