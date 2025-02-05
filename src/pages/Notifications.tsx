import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();

  // Example notifications data - in a real app, this would come from an API
  const notifications = [
    {
      id: 1,
      title: "New Gift Received!",
      message: "Sarah sent you a birthday gift",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Gift Delivered",
      message: "Your gift to John has been delivered",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "Special Offer",
      message: "Get 20% off your next gift purchase",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Notifications</h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Notifications;