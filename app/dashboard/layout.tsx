import SideNavBar from "./components/SideNavBar";
import SearchFields from "./components/SearchFields";
import ToogleView from "./components/ToogleView";
import { ViewProvider } from "./context/ViewContext";
import { ApiDataProvider } from "./context/ApiDataContext";
import { SearchProvider } from "./context/SearchContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
            <SideNavBar />
            <SidebarInset>
              <header className="flex pt-2 justify-start shrink-0 items-center gap-2  px-5">
                {/* <SidebarTrigger className='-ml-1' /> */}
                {/* <Separator orientation='vertical' className='mr-2 h-4' /> */}
              </header>
              <div className="pr-5 pl-5 flex flex-col space-y-8">
                <SearchFields />
                <ToogleView />
                <div>{children}</div>
              </div>
            </SidebarInset>
          </ApiDataProvider>
        </SearchProvider>
      </ViewProvider>
    </SidebarProvider>
  );
}
