import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DWLogo from "@/components/ui/DWLogo";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const handleLogoClick = () => {
    return "/";
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const renderAuthSection = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">
                  {getInitials(user.email)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuItem className="text-sm text-gray-500 font-medium px-3 py-2">
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-3 py-2">
              <Link to="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-3 py-2">
              <Link to="/create">Create Quiz</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="px-3 py-2 text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild className="text-gray-600 font-medium">
          <Link to="/sign-in">Sign In</Link>
        </Button>
        <Button size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link to="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link to={handleLogoClick()} className="flex items-center space-x-2">
            <DWLogo />
            <span className="font-semibold text-xl tracking-tight">Docwiz</span>
          </Link>
          
          {user && location.pathname !== '/' && (
            <div className="flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/create"
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Create Quiz
              </Link>
              <Link
                to="/templates"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/templates"
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Templates
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {renderAuthSection()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 