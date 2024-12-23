import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import DWLogo from "@/components/ui/DWLogo";
import {
  Home,
  Plus,
  Settings,
  LogOut,
  FileText,
  History,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    { name: "Dashboard", to: "/dashboard", icon: Home },
    { name: "Create Quiz", to: "/create", icon: Plus },
    { name: "Templates", to: "/templates", icon: FileText },
    { name: "History", to: "/history", icon: History },
    { name: "Chat AI", to: "/chat", icon: MessageSquare },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <DWLogo />
            <span className="font-semibold text-xl tracking-tight">Docwiz</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.to}
                        className={cn(
                          isActive
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-6 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start gap-x-3 text-gray-700 hover:text-red-600 hover:bg-gray-50"
                onClick={signOut}
              >
                <LogOut className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                Sign out
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
