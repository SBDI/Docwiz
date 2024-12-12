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
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="text-sm text-gray-500">
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/create">Create Quiz</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/sign-in">Sign In</Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link to="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to={handleLogoClick()} className="flex items-center space-x-2">
            <DWLogo />
            <span className="font-semibold text-xl">Docwiz</span>
          </Link>
          
          {user && location.pathname !== '/' && (
            <div className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium ${
                  location.pathname === "/dashboard"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className={`text-sm font-medium ${
                  location.pathname === "/create"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Quiz
              </Link>
              <Link
                to="/templates"
                className={`text-sm font-medium ${
                  location.pathname === "/templates"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
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