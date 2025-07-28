import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
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
import AddBranch from './pages/AddBranch';
import AgentVisits from './pages/AgentVisits';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const navigate = useNavigate();
  
  const handleLogin = (username: string) => {
    navigate('/dashboard');
  };
  
  return (
    <>
      {!isLoginPage && <TopBar />}
      <div style={{ paddingTop: isLoginPage ? 0 : 56 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<Dashboard onNavigate={() => {}} />} />
            <Route path="/merchants" element={<Merchants onNavigate={() => {}} />} />
            <Route path="/merchant/:id" element={<MerchantDetail onNavigate={() => {}} />} />
            <Route path="/add-merchant" element={<AddNewMerchant />} />
            <Route path="/visitreport" element={<VisitReport />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/verification-code" element={<VerificationCode />} />
            <Route path="/subscription-confirmation" element={<SubscriptionConfirmation />} />
            <Route path="/profile" element={<UserProfileInfo />} />
            <Route path="/add-branch" element={<AddBranch />} />
            <Route path="/agent-visits" element={<AgentVisits />} />
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
      <HashRouter>
        <AppContent />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
