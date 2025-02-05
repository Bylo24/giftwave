import { Card } from "@/components/ui/card";

interface SearchResultProps {
  id: number;
  name: string;
  username: string;
  onClick: () => void;
}

export const SearchResult = ({ id, name, username, onClick }: SearchResultProps) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-[#D6BCFA]/20 transition-colors border-[#9b87f5]"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-[#9b87f5] rounded-full" />
        <div>
          <h3 className="font-medium text-[#1A1F2C]">{name}</h3>
          <p className="text-sm text-[#7E69AB]">{username}</p>
        </div>
      </div>
    </Card>
  );
};