
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
    { icon: Gift, label: "Gift", path: "/gift", isCenter: true },
    { icon: Gift, label: "My Gifts", path: "/my-gifts" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="flex justify-around items-center h-16 relative">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full text-xs",
              location.pathname === item.path ? "text-primary" : "text-gray-500",
              item.isCenter && "-mt-6"
            )}
          >
            {item.isCenter ? (
              <div className="bg-primary rounded-full p-4 mb-1">
                <item.icon className="h-8 w-8 text-white" />
              </div>
            ) : (
              <item.icon className="h-5 w-5 mb-1" />
            )}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
