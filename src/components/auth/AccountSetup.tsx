import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AccountSetup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in bg-background">
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Let's set up your account
          </h1>
          <p className="text-sm text-gray-500">
            We need your legal name to make sure it's really you. To add a preferred
            name, go to Settings {'>'} Edit Profile.
          </p>
        </div>

        <div className="relative w-24 h-24 mx-auto">
          <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-sm text-gray-500">Add photo</span>
          </div>
          <button className="absolute bottom-0 right-0 p-1 bg-primary rounded-full text-white">
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Legal first name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <Input
            placeholder="Legal last name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <Input
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
            <li>Must be 8-20 characters</li>
            <li>Must include at least one number or symbol like (!@#$%)</li>
          </ul>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};