import React from "react";
import { GiftDesign } from "@/types/gift";

interface PreviewCardProps {
  pageIndex: number;
  themeOption: {
    text: string;
    emoji: string;
    bgColor: string;
    textColors: string[];
    pattern: {
      type: string;
      color: string;
    };
  };
  getPatternStyle: (pattern: { type: string; color: string }) => React.CSSProperties;
  giftDesign: GiftDesign;
}

export const PreviewCard = ({ 
  pageIndex, 
  themeOption, 
  getPatternStyle, 
  giftDesign 
}: PreviewCardProps) => {
  const frontCardContent = (
    <>
      <div className="text-6xl md:text-7xl font-dancing text-shadow-md">
        {themeOption.emoji}
      </div>
      <h2 className={`text-4xl md:text-5xl font-playfair font-bold text-center text-shadow-sm ${themeOption.textColors.join(' ')}`}>
        {themeOption.text}
      </h2>
      <p className="text-sm md:text-base font-montserrat text-gray-700 text-center mt-2 px-4">
        {giftDesign.recipient_name}
      </p>
    </>
  );

  const backCardContent = (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <p className="text-lg md:text-xl font-roboto-slab text-gray-800 text-center">
        {giftDesign.message}
      </p>
    </div>
  );

  const leftCardContent = (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <p className="text-lg md:text-xl font-roboto-slab text-gray-800 text-center">
        {giftDesign.sender_name}
      </p>
    </div>
  );

  const rightCardContent = (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <p className="text-lg md:text-xl font-roboto-slab text-gray-800 text-center">
        {giftDesign.gift_details}
      </p>
    </div>
  );

  switch (pageIndex) {
    case 0:
      return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0"
            style={getPatternStyle(themeOption.pattern)}
          />
          {/* Changed padding and added justify-end to move content lower */}
          <div className="relative z-10 h-full flex flex-col items-center justify-end p-8 pb-16">
            {frontCardContent}
          </div>
        </div>
      );
    case 1:
      return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          {leftCardContent}
        </div>
      );
    case 2:
      return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          {rightCardContent}
        </div>
      );
    case 3:
      return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          {backCardContent}
        </div>
      );
    default:
      return null;
  }
};
