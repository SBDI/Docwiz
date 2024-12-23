import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  PlusCircle,
  History,
  Settings,
  LogOut,
  Book
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Create Quiz', href: '/create', icon: PlusCircle },
  { name: 'My Quizzes', href: '/history', icon: History },
  { name: 'Templates', href: '/templates', icon: Book },
];

export function SideNav() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-semibold text-xl">Docwiz</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[rgb(79,70,229)] text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[rgb(79,70,229)]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t">
        {user && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 px-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === '/settings'
                    ? "bg-[rgb(79,70,229)] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[rgb(79,70,229)]"
                )}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[rgb(79,70,229)]"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
