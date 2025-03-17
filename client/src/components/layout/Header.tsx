import { Link } from "wouter";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-black/50 backdrop-blur-md">
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-white" />
          <span className="font-bold text-2xl text-white tracking-wider">NIGHTHAWK</span>
        </Link>
        <NavigationMenu className="ml-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/report">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white hover:text-primary"}>
                  REPORT CRIME
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/request">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white hover:text-primary"}>
                  REQUEST PERMISSION
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/apply">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " text-white hover:text-primary"}>
                  JOIN US
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}