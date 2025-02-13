
import { useState, useRef, useEffect } from "react";
import { motion, PanInfo, useMotionValue } from "framer-motion";

interface EditableTextProps {
  initialText: string;
  initialX?: number;
  initialY?: number;
  className?: string;
  onTextChange?: (text: string) => void;
}

export const EditableText = ({ 
  initialText, 
  initialX = 0, 
  initialY = 0, 
  className = "",
  onTextChange 
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    x.set(x.get() + info.offset.x);
    y.set(y.get() + info.offset.y);
  };

  if (isEditing) {
    return (
      <motion.div
        style={{ x, y }}
        drag
        onDragEnd={handleDragEnd}
        className="relative group cursor-move"
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTextChange?.(e.target.value);
          }}
          onBlur={() => setIsEditing(false)}
          className={`${className} resize-none outline-none border-2 border-blue-500 rounded p-1 bg-white/80 backdrop-blur-sm min-w-[100px] min-h-[50px]`}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ x, y }}
      drag
      onDragEnd={handleDragEnd}
      onClick={() => setIsEditing(true)}
      className="relative group cursor-move"
    >
      <p className={`${className} whitespace-pre-wrap`}>{text}</p>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded" />
    </motion.div>
  );
};
