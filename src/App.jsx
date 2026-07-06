import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// import AuthCallback from '@/pages/AuthCallback'; // only used by Google OAuth, deferred to a later release

// Site pages
import SiteLayout from '@/components/layout/SiteLayout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQs from '@/pages/FAQs';
import COASearch from '@/pages/COASearch';
import ResearchHub from '@/pages/ResearchHub';
import PeptideDetail from '@/pages/PeptideDetail';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import CookiePolicy from '@/pages/CookiePolicy';
import SuppliesGuide from '@/pages/SuppliesGuide';
import BeginnerGuide from '@/pages/BeginnerGuide';
import ProtocolCalculator from '@/pages/ProtocolCalculator';
import Ambassador from '@/pages/Ambassador';
import Glossary from '@/pages/Glossary';
import Wholesale from '@/pages/Wholesale';
import SearchPage from '@/pages/Search';
import Account from '@/pages/Account';
import BacWaterPage from '@/pages/BacWaterPage';
import Checkout from '@/pages/Checkout';
import OrderStatus from '@/pages/OrderStatus';
import DevCryptoStub from '@/pages/DevCryptoStub';
import AdminOrders from '@/pages/AdminOrders';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  // Brief — resolves instantly when there's no stored token, or after one /me call when there is.
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-sm text-muted-foreground font-body">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* <Route path="/auth/callback" element={<AuthCallback />} /> only used by Google OAuth, deferred */}

      {/* Public site routes */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/bpc-157" element={<Navigate to="/peptide/bpc157" replace />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/catalog" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/coa" element={<COASearch />} />
        <Route path="/research" element={<ResearchHub />} />
        <Route path="/peptide/:id" element={<PeptideDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/supplies" element={<SuppliesGuide />} />
        <Route path="/guide" element={<BeginnerGuide />} />
        <Route path="/protocol" element={<ProtocolCalculator />} />
        <Route path="/ambassador" element={<Ambassador />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/wholesale" element={<Wholesale />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/bac-water" element={<BacWaterPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderStatus />} />
        <Route path="/dev/crypto-stub/:id" element={<DevCryptoStub />} />

        {/* Requires login — redirects to /login if not authenticated.
            AdminOrders does its own role check and shows an "admin required" message
            for non-admins, so it only needs the login gate here. */}
        <Route element={<ProtectedRoute unauthenticatedElement={<RedirectToLogin />} />}>
          <Route path="/account" element={<Account />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function RedirectToLogin() {
  const { navigateToLogin } = useAuth();
  useEffect(() => { navigateToLogin(); }, [navigateToLogin]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App