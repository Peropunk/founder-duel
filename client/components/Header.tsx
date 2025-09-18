import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationButton from "@/components/NotificationButton";

const logoUrl =
  "https://cdn.builder.io/api/v1/image/assets%2F462fdc1538bd468b99eec373dc088499%2F145889f40d2c4fc2b66976c7dd17929e?format=webp&width=400";

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoUrl} alt="FounderDuel" className="h-8 w-auto" />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive || location.pathname === "/"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Profile
          </NavLink>
          {user && (
            <NavLink
              to="/challenges"
              className={({ isActive }) =>
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Challenges
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user && <NotificationButton />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.avatarUrl ?? undefined}
                    alt={user.name ?? user.email ?? ""}
                  />
                  <AvatarFallback>
                    {(user.name ?? user.email ?? "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Edit profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/me">View profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
