
import { createContext, useContext, useState } from 'react';
import { ThemeOption } from '@/types/gift';
import { themeOptions } from '@/constants/giftOptions';

interface GiftContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  messageVideo: File | null;
  setMessageVideo: (video: File | null) => void;
  messageVideoUrl: string | null;
  setMessageVideoUrl: (url: string | null) => void;
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
  setMemories: (memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>) => void;
  amount: string;
  setAmount: (amount: string) => void;
  recipientPhone: string;
  setRecipientPhone: (phone: string) => void;
  giftId: string | null;
  setGiftId: (id: string | null) => void;
  reset: () => void;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export const GiftProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeOption>(themeOptions[0]);
  const [messageVideo, setMessageVideo] = useState<File | null>(null);
  const [messageVideoUrl, setMessageVideoUrl] = useState<string | null>(null);
  const [memories, setMemories] = useState<Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>>([]);
  const [amount, setAmount] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [giftId, setGiftId] = useState<string | null>(null);

  const reset = () => {
    setTheme(themeOptions[0]);
    setMessageVideo(null);
    setMessageVideoUrl(null);
    setMemories([]);
    setAmount("");
    setRecipientPhone("");
    setGiftId(null);
  };

  return (
    <GiftContext.Provider value={{
      theme,
      setTheme,
      messageVideo,
      setMessageVideo,
      messageVideoUrl,
      setMessageVideoUrl,
      memories,
      setMemories,
      amount,
      setAmount,
      recipientPhone,
      setRecipientPhone,
      giftId,
      setGiftId,
      reset
    }}>
      {children}
    </GiftContext.Provider>
  );
};

export const useGift = () => {
  const context = useContext(GiftContext);
  if (context === undefined) {
    throw new Error('useGift must be used within a GiftProvider');
  }
  return context;
};
