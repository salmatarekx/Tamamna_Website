import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TopBar from './components/TopBar';
import Merchants from './pages/Merchants';
import AddNewMerchant from './pages/AddNewMerchant';
import VisitReport from './pages/VisitReport';
import Packages from './pages/Packages';
import VerificationCode from './pages/VerificationCode';
import SubscriptionConfirmation from './pages/SubscriptionConfirmation';
import MerchantDetail from './pages/MerchantDetail';
import UserProfileInfo from './pages/UserProfileInfo';

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <>
      {!isLoginPage && <TopBar />}
      <div style={{ paddingTop: isLoginPage ? 0 : 56 }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login onLogin={() => {}} />} />
          <Route path="/dashboard" element={<Dashboard onNavigate={() => {}} />} />
          <Route path="/merchants" element={<Merchants onNavigate={() => {}} />} />
          <Route path="/merchant/:id" element={<MerchantDetail />} />
          <Route path="/add-merchant" element={<AddNewMerchant />} />
          <Route path="/visitreport" element={<VisitReport />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/verification-code" element={<VerificationCode />} />
          <Route path="/subscription-confirmation" element={<SubscriptionConfirmation />} />
          <Route path="/profile" element={<UserProfileInfo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
