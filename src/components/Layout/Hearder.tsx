"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Settings,
  LogOut,
  User,
  Menu,
  Shield,
  ChevronDown,
} from "lucide-react";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { Sidebar } from "./SideBar";
import { useAuthStore } from "@/store/authStore";
import { createClient, supabase } from "@/supabse-client";
import { toast } from "sonner";

// Header Navigation Component
export const HeaderNavigation = () => {
  const { push } = useProgressBarNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleLogout = async () => {
    const SignOut = await supabase.auth.signOut();
    if (SignOut.error) {
      toast.error(`Error while trying to sign out, ${SignOut.error}`);
    } else {
      toast.success(`Signed Out`);
      push("/auth/login");
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 max-w-full">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
              <div className="relative bg-primary rounded-full p-2">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className=" sm:block">
              <h1 className="text-lg font-bold">A&G Insurance</h1>
              <p className="text-xs text-muted-foreground">
                Vehicle Maintenance
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 h-auto"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={
                    user && user.image_url != null ? user.image_url != null : ""
                  }
                  alt={user && user.full_name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials(user ? user.full_name : "AG")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user && user.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {user && user.role}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user && user.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {user && user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* removed profile and seetings for now */}
            {/* <DropdownMenuItem
              onClick={() => push("/profile")}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => push("/settings")}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
