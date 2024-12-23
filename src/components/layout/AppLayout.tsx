import { useAuth } from "@/lib/auth";
import { SideNav } from "./SideNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Side Navigation */}
      <div className="w-64 flex-shrink-0">
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
