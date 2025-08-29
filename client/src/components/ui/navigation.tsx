import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { WandSparkles, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <WandSparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Coding Guru</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant={location === '/' ? 'default' : 'ghost'}
            onClick={() => setLocation('/')}
            data-testid="nav-dashboard"
          >
            Dashboard
          </Button>
          <Button
            variant={location === '/code-preview' ? 'default' : 'ghost'}
            onClick={() => setLocation('/code-preview')}
            data-testid="nav-code-preview"
          >
            Code Preview
          </Button>
          <Button
            variant={location === '/backend-builder' ? 'default' : 'ghost'}
            onClick={() => setLocation('/backend-builder')}
            data-testid="nav-backend"
          >
            Backend
          </Button>
          <Button
            variant={location === '/deploy' ? 'default' : 'ghost'}
            onClick={() => setLocation('/deploy')}
            data-testid="nav-deploy"
          >
            Deploy
          </Button>
        </nav>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2" data-testid="user-menu">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {user?.firstName || user?.email || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
