"use client";
import { Car, FileText, LayoutDashboard, Settings, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "../ui/badge";

export const Sidebar = ({
  setIsOpen,
}: {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const { push } = useProgressBarNavigation();
  const { user } = useAuthStore();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Vehicles",
      href: "/dashboard/vehicles",
      icon: Car,
    },
    {
      title: "Compliance History",
      href: "/dashboard/compliance-history",
      icon: FileText,
    },
    {
      title: "Generate Role Key",
      href: "/dashboard/generate-role-key",
      icon: Settings,
    },
    // {
    //   title: "Documents",
    //   href: "/dashboard/documents",
    //   icon: Folder,
    // },
    // {
    //   title: "Notifications",
    //   href: "/dashboard/notifications",
    //   icon: Bell,
    //   isComingSoon: true,
    // },
    // {
    //   title: "Settings",
    //   href: "/dashboard/settings",
    //   icon: Settings,
    //   isComingSoon: true,
    // },
  ];

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Sidebar Header */}
      <div className=" flex md:hidden h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
            <div className="relative bg-primary rounded-full p-2">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">A&G Insurance</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          if (
            (item.href == "/dashboard/generate-role-key" ||
              item.href == "/dashboard/compliance-history") &&
            user &&
            user.role != "IT"
          ) {
            return;
          }

          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              disabled={item.isComingSoon}
              className={cn(
                "w-full justify-start gap-3 cursor-pointer",
                item.isComingSoon && "text-gray",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent"
              )}
              onClick={() => {
                setIsOpen && setIsOpen(false);
                push(item.href);
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
              {item.isComingSoon && (
                <Badge variant="secondary" className="text-xs">
                  Coming soon
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {/* removed the sidebar footer for now */}
      {/* <div className="border-t border-border p-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <p className="text-xs font-medium text-primary">Need Help?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Contact support for assistance
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => toast.info("Contact us at aginsurance.com")}
          >
            Get Support
          </Button>
        </div>
      </div> */}
    </div>
  );
};
