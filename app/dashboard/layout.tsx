"use client";
import SideNavBar from "./components/SideNavBar";
import SearchFields from "./components/SearchFields";
import ToogleView from "./components/ToogleView";
import { ViewProvider } from "./context/ViewContext";
import { ApiDataProvider } from "./context/ApiDataContext";
import { SearchProvider } from "./context/SearchContext";
import { SpinnerProvider } from "./context/SpinnerContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Spinner from "@/components/ui/Spinner/Spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ViewProvider>
        <SearchProvider>
          <ApiDataProvider>
            <SpinnerProvider>
              <Spinner />
              <div className="w-full flex space-x-6">
                <div className="w-[20%]">
                  <SideNavBar />
                </div>
                <SidebarInset className="w-[80%]">
                  <header className="flex pt-2 justify-start shrink-0 items-center gap-2 "></header>
                  <div className="px-6 flex flex-col space-y-8">
                    <SearchFields />
                    <ToogleView />
                    <div>{children}</div>
                  </div>
                </SidebarInset>
              </div>
            </SpinnerProvider>
          </ApiDataProvider>
        </SearchProvider>
      </ViewProvider>
    </SidebarProvider>
  );
}
