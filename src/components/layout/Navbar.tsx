import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DWLogo from "@/components/ui/DWLogo";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const renderAuthSection = () => {
    if (user) {
      return (
        <div className="flex items-center gap-x-4 lg:gap-x-6">
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
        </div>
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

  // Only show the mobile menu button when logged in
  const renderMobileMenuButton = () => {
    if (!user) return null;

    return (
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open sidebar</span>
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 items-center gap-x-4 px-4 sm:px-6 lg:px-8">
        {renderMobileMenuButton()}
        
        {!user && (
          <Link to="/" className="flex items-center space-x-2">
            <DWLogo />
            <span className="font-semibold text-xl tracking-tight">Docwiz</span>
          </Link>
        )}

        <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
          {renderAuthSection()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;