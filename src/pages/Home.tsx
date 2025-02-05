import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Welcome to Heartfelt Gifting
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect gift for your loved ones with our personalized recommendations
          </p>
          <Button
            size="lg"
            className="mt-6"
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Suggestions</CardTitle>
              <CardDescription>
                Get tailored gift recommendations based on interests and occasions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our smart algorithm helps you find the perfect gift every time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gift Registry</CardTitle>
              <CardDescription>
                Create and share your wishlist with friends and family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Make gift-giving easier by letting others know what you'd love
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Occasions</CardTitle>
              <CardDescription>
                Never miss an important date with our reminder system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Set up reminders for birthdays, anniversaries, and special events
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;