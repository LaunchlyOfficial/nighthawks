import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ReportCrime from "@/pages/ReportCrime";
import RequestPermission from "@/pages/RequestPermission";
import Apply from "@/pages/Apply";
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CP from "./components/ui/CP";
import ReportStatus from "@/pages/ReportStatus";
import Login from "@/pages/Login";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/report" component={ReportCrime} />
      <Route path="/request" component={RequestPermission} />
      <Route path="/apply" component={Apply} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/report-status/:id" component={ReportStatus} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="min-h-screen pt-16">
        <Router />
      </main>
      <Footer />
      <Toaster />
      <CP />
    </QueryClientProvider>
  );
}

export default App;
