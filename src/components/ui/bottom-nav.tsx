
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Gift, Wallet, User } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { 
      icon: Home, 
      label: 'Home', 
      href: '/home'
    },
    { 
      icon: Gift, 
      label: 'Gift', 
      href: '/frontcard' 
    },
    { 
      icon: Wallet, 
      label: 'Wallet', 
      href: '/wallet'
    },
    { 
      icon: User, 
      label: 'Profile', 
      href: '/profile'
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => navigate(link.href)}
              className="group flex flex-col items-center"
            >
              {link.label === 'Gift' ? (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg group-hover:shadow-indigo-200/50 transition-all duration-200 -mt-2">
                  <link.icon className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className={`p-2 rounded-xl ${isActive(link.href) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  <link.icon className="h-6 w-6" />
                </div>
              )}
              <span className={`text-xs mt-1 ${isActive(link.href) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {link.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
