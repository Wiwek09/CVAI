import SideNavBar from './components/SideNavBar';
import SearchFields from './components/SearchFields';
import ToogleView from './components/ToogleView';
import { ViewProvider } from './context/ViewContext';
import { ApiDataProvider } from './context/ApiDataContext';
import { SearchProvider } from './context/SearchContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewProvider>
      <SearchProvider>
        <ApiDataProvider>
          <div className=' w-full  flex  '>
            <div className='w-[19.5%] fixed left-0 bg-black'>
              <SideNavBar />
            </div>
            <div className='w-[80%] px-5 ml-[19rem] flex flex-col space-y-8 '>
              <SearchFields />
              <ToogleView />
              <div>{children}</div>
            </div>
          </div>
        </ApiDataProvider>
      </SearchProvider>
    </ViewProvider>
  );
}
