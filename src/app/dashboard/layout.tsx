import { HeaderNavigation } from "@/components/Layout/Hearder";
import { Sidebar } from "@/components/Layout/SideBar";

// Layout Wrapper Component (Optional - combines Header + Sidebar + Content)
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background w-full">
      <HeaderNavigation />
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <Sidebar />
        </aside>
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 w-screen">
          <div className="container py-6 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
