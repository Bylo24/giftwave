
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
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <nav className="bg-white/80 backdrop-blur-lg border border-gray-200/20 rounded-2xl shadow-lg">
        <div className="flex justify-around items-center h-16 relative px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full text-xs relative group transition-all duration-200",
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-700",
                item.isCenter && "-mt-8"
              )}
            >
              {item.isCenter ? (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg group-hover:shadow-indigo-200/50 transition-all duration-200 -mt-2">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
              ) : (
                <>
                  <item.icon className="h-5 w-5 mb-1 transition-transform group-hover:scale-110 duration-200" />
                  <span className="font-medium opacity-90">{item.label}</span>
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 w-1 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
