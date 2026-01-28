import { Link, useLocation } from "wouter";
import { ShoppingBag, UserPlus, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link href="/products">
        <Button 
          variant={location === "/products" || location === "/" ? "default" : "ghost"} 
          className="w-full justify-start md:w-auto md:justify-center"
          onClick={() => setIsOpen(false)}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Products
        </Button>
      </Link>
      <Link href="/register">
        <Button 
          variant={location === "/register" ? "default" : "ghost"}
          className="w-full justify-start md:w-auto md:justify-center"
          onClick={() => setIsOpen(false)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Register
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Luxe<span className="text-primary">Market</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavItems />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
