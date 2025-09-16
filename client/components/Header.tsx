import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const logoUrl = "https://cdn.builder.io/api/v1/image/assets%2F462fdc1538bd468b99eec373dc088499%2F145889f40d2c4fc2b66976c7dd17929e?format=webp&width=400";

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
          <NavLink to="/" className={({isActive}) => isActive || location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>Home</NavLink>
          <NavLink to="/profile" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>Profile</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">{user.email ?? user.name ?? "User"}</span>
              <Button variant="secondary" onClick={() => signOut()}>Sign out</Button>
            </>
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
